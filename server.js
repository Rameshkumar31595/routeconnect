import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new DatabaseSync(path.join(__dirname, 'routeconnect.db'));

// Create users table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;
db.exec(createTableQuery);

// Recreate locations and segments tables cleanly to support AP + Interstate coverage
db.exec("DROP TABLE IF EXISTS locations;");
db.exec("DROP TABLE IF EXISTS segments;");

const createLocationsTableQuery = `
  CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    mandal TEXT,
    district TEXT,
    state TEXT,
    type TEXT
  )
`;
db.exec(createLocationsTableQuery);

const createSegmentsTableQuery = `
  CREATE TABLE segments (
    id TEXT PRIMARY KEY,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    mode TEXT NOT NULL,
    operator TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    distance_km REAL NOT NULL,
    price REAL NOT NULL,
    departure_time TEXT,
    arrival_time TEXT,
    train_name TEXT,
    train_number TEXT,
    service_name TEXT,
    stops TEXT
  )
`;
db.exec(createSegmentsTableQuery);

// Seed locations: AP villages + Indian Major Cities
const insertLocation = db.prepare(`
  INSERT INTO locations (id, name, latitude, longitude, mandal, district, state, type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const sampleLocations = [
  // West Godavari (AP)
  ['bhimavaram', 'Bhimavaram', 16.5449, 81.5224, 'Bhimavaram', 'West Godavari', 'Andhra Pradesh', 'city'],
  ['bhimavaram railway station', 'Bhimavaram Railway Station', 16.5410, 81.5150, 'Bhimavaram', 'West Godavari', 'Andhra Pradesh', 'station'],
  ['bhimavaram junction', 'Bhimavaram Junction', 16.5410, 81.5150, 'Bhimavaram', 'West Godavari', 'Andhra Pradesh', 'station'],
  ['bhimavaram bus station', 'Bhimavaram Bus Station', 16.5490, 81.5280, 'Bhimavaram', 'West Godavari', 'Andhra Pradesh', 'bus'],
  ['undi', 'Undi', 16.6025, 81.4616, 'Undi', 'West Godavari', 'Andhra Pradesh', 'village'],
  
  // Duplicate Undi entry for demonstrating duplicate places lookup
  ['undi (chinna mandal)', 'Undi (Chinna Mandal)', 14.5020, 77.8010, 'Chinna Mandal', 'Sri Sathya Sai', 'Andhra Pradesh', 'village'],

  ['akividu', 'Akividu', 16.6015, 81.3787, 'Akividu', 'West Godavari', 'Andhra Pradesh', 'town'],
  ['akividu railway station', 'Akividu Railway Station', 16.6010, 81.3780, 'Akividu', 'West Godavari', 'Andhra Pradesh', 'station'],
  ['akividu bus station', 'Akividu Bus Station', 16.6025, 81.3800, 'Akividu', 'West Godavari', 'Andhra Pradesh', 'bus'],
  ['veeravasaram', 'Veeravasaram', 16.5160, 81.6030, 'Veeravasaram', 'West Godavari', 'Andhra Pradesh', 'village'],
  ['kalla', 'Kalla', 16.5515, 81.4550, 'Kalla', 'West Godavari', 'Andhra Pradesh', 'village'],
  ['kalla bus stop', 'Kalla Bus Stop', 16.5510, 81.4540, 'Kalla', 'West Godavari', 'Andhra Pradesh', 'bus'],
  ['mogalthur', 'Mogalthur', 16.4170, 81.5975, 'Mogalthur', 'West Godavari', 'Andhra Pradesh', 'village'],
  ['palakollu', 'Palakollu', 16.5262, 81.7282, 'Palakollu', 'West Godavari', 'Andhra Pradesh', 'town'],
  ['narasapuram', 'Narasapuram', 16.4385, 81.7016, 'Narasapuram', 'West Godavari', 'Andhra Pradesh', 'town'],
  ['narsapur railway station', 'Narsapur Railway Station', 16.4380, 81.6970, 'Narasapuram', 'West Godavari', 'Andhra Pradesh', 'station'],
  ['penugonda', 'Penugonda', 16.6310, 81.7240, 'Penugonda', 'West Godavari', 'Andhra Pradesh', 'village'],
  ['attili', 'Attili', 16.6890, 81.5980, 'Attili', 'West Godavari', 'Andhra Pradesh', 'village'],
  ['ganapavaram', 'Ganapavaram', 16.6912, 81.4880, 'Ganapavaram', 'Eluru', 'Andhra Pradesh', 'village'],
  ['kakinada', 'Kakinada', 16.9890, 82.2474, 'Kakinada', 'Kakinada', 'Andhra Pradesh', 'town'],

  // NTR (Vijayawada)
  ['vijayawada', 'Vijayawada', 16.5062, 80.6480, 'Vijayawada', 'NTR', 'Andhra Pradesh', 'city'],
  ['vijayawada railway station', 'Vijayawada Railway Station', 16.5180, 80.6200, 'Vijayawada', 'NTR', 'Andhra Pradesh', 'station'],
  ['vijayawada bus station', 'Vijayawada Bus Station', 16.5120, 80.6280, 'Vijayawada', 'NTR', 'Andhra Pradesh', 'bus'],
  ['vijayawada final destination', 'Vijayawada Final Destination', 16.5020, 80.6400, 'Vijayawada', 'NTR', 'Andhra Pradesh', 'landmark'],
  ['vijayawada airport', 'Vijayawada Airport', 16.5310, 80.7960, 'Gannavaram', 'NTR', 'Andhra Pradesh', 'airport'],
  ['kanaka durga temple', 'Kanaka Durga Temple', 16.5152, 80.6050, 'Vijayawada', 'NTR', 'Andhra Pradesh', 'landmark'],
  ['ibrahimpatnam', 'Ibrahimpatnam', 16.5898, 80.5230, 'Ibrahimpatnam', 'NTR', 'Andhra Pradesh', 'town'],
  ['nandigama', 'Nandigama', 16.7847, 80.2917, 'Nandigama', 'NTR', 'Andhra Pradesh', 'town'],

  // Krishna
  ['machilipatnam', 'Machilipatnam', 16.1875, 81.1390, 'Machilipatnam', 'Krishna', 'Andhra Pradesh', 'city'],
  ['gudivada', 'Gudivada', 16.4410, 80.9930, 'Gudivada', 'Krishna', 'Andhra Pradesh', 'town'],
  ['challapalli', 'Challapalli', 16.1185, 80.9310, 'Challapalli', 'Krishna', 'Andhra Pradesh', 'village'],
  ['vuyyuru', 'Vuyyuru', 16.3685, 80.8490, 'Vuyyuru', 'Krishna', 'Andhra Pradesh', 'town'],

  // Visakhapatnam
  ['visakhapatnam', 'Visakhapatnam', 17.6868, 83.2185, 'Visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh', 'city'],
  ['visakhapatnam railway station', 'Visakhapatnam Railway Station', 17.6912, 83.2986, 'Visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh', 'station'],
  ['dwaraka bus complex', 'Dwaraka Bus Complex', 17.7215, 83.3012, 'Visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh', 'bus'],
  ['visakhapatnam airport', 'Visakhapatnam Airport', 17.7210, 83.2240, 'Visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh', 'airport'],
  ['gajuwaka', 'Gajuwaka', 17.6896, 83.1878, 'Gajuwaka', 'Visakhapatnam', 'Andhra Pradesh', 'town'],

  // Guntur
  ['guntur', 'Guntur', 16.3067, 80.4365, 'Guntur', 'Guntur', 'Andhra Pradesh', 'city'],
  ['guntur railway station', 'Guntur Railway Station', 16.3012, 80.4440, 'Guntur', 'Guntur', 'Andhra Pradesh', 'station'],
  ['guntur bus station', 'Guntur Bus Station', 16.3050, 80.4500, 'Guntur', 'Guntur', 'Andhra Pradesh', 'bus'],
  ['tenali', 'Tenali', 16.2396, 80.6467, 'Tenali', 'Guntur', 'Andhra Pradesh', 'city'],
  ['mangalagiri', 'Mangalagiri', 16.4326, 80.5658, 'Mangalagiri', 'Guntur', 'Andhra Pradesh', 'town'],
  ['amaravati', 'Amaravati', 16.5744, 80.3575, 'Amaravati', 'Guntur', 'Andhra Pradesh', 'village'],

  // Tirupati
  ['tirupati', 'Tirupati', 13.6288, 79.4192, 'Tirupati', 'Tirupati', 'Andhra Pradesh', 'city'],
  ['tirupati railway station', 'Tirupati Railway Station', 13.6275, 79.4168, 'Tirupati', 'Tirupati', 'Andhra Pradesh', 'station'],
  ['tirupati bus station', 'Tirupati Bus Station', 13.6260, 79.4215, 'Tirupati', 'Tirupati', 'Andhra Pradesh', 'bus'],
  ['renigunta', 'Renigunta', 13.6385, 79.5160, 'Renigunta', 'Tirupati', 'Andhra Pradesh', 'town'],

  // East Godavari
  ['rajahmundry', 'Rajahmundry', 17.0005, 81.7835, 'Rajahmundry', 'East Godavari', 'Andhra Pradesh', 'city'],
  ['rajahmundry railway station', 'Rajahmundry Railway Station', 16.9912, 81.7790, 'Rajahmundry', 'East Godavari', 'Andhra Pradesh', 'station'],
  ['rajahmundry bus station', 'Rajahmundry Bus Station', 17.0010, 81.7890, 'Rajahmundry', 'East Godavari', 'Andhra Pradesh', 'bus'],
  ['kovvur', 'Kovvur', 17.0145, 81.7240, 'Kovvur', 'East Godavari', 'Andhra Pradesh', 'town'],

  // Other AP Cities
  ['nellore', 'Nellore', 14.4426, 79.9865, 'Nellore', 'SPS Nellore', 'Andhra Pradesh', 'city'],
  ['kurnool', 'Kurnool', 15.8281, 78.0373, 'Kurnool', 'Kurnool', 'Andhra Pradesh', 'city'],

  // North India Cities
  ['delhi', 'Delhi', 28.6139, 77.2090, 'Delhi', 'Delhi', 'Delhi NCR', 'city'],
  ['chandigarh', 'Chandigarh', 30.7333, 76.7794, 'Chandigarh', 'Chandigarh', 'Chandigarh', 'city'],
  ['jaipur', 'Jaipur', 26.9124, 75.7873, 'Jaipur', 'Jaipur', 'Rajasthan', 'city'],
  ['lucknow', 'Lucknow', 26.8467, 80.9462, 'Lucknow', 'Lucknow', 'Uttar Pradesh', 'city'],
  ['kanpur', 'Kanpur', 26.4499, 80.3319, 'Kanpur', 'Kanpur', 'Uttar Pradesh', 'city'],
  ['agra', 'Agra', 27.1767, 78.0081, 'Agra', 'Agra', 'Uttar Pradesh', 'city'],
  ['varanasi', 'Varanasi', 25.3176, 82.9739, 'Varanasi', 'Varanasi', 'Uttar Pradesh', 'city'],
  ['amritsar', 'Amritsar', 31.6340, 74.8723, 'Amritsar', 'Amritsar', 'Punjab', 'city'],
  ['dehradun', 'Dehradun', 30.3165, 78.0322, 'Dehradun', 'Dehradun', 'Uttarakhand', 'city'],
  ['srinagar', 'Srinagar', 34.0837, 74.7973, 'Srinagar', 'Srinagar', 'Jammu & Kashmir', 'city'],
  ['jammu', 'Jammu', 32.7266, 74.8570, 'Jammu', 'Jammu', 'Jammu & Kashmir', 'city'],

  // South India Interstate Cities
  ['hyderabad', 'Hyderabad', 17.3850, 78.4867, 'Hyderabad', 'Hyderabad', 'Telangana', 'city'],
  ['bengaluru', 'Bengaluru', 12.9716, 77.5946, 'Bengaluru', 'Bengaluru Urban', 'Karnataka', 'city'],
  ['chennai', 'Chennai', 13.0827, 80.2707, 'Chennai', 'Chennai', 'Tamil Nadu', 'city'],
  ['kochi', 'Kochi', 9.9312, 76.2673, 'Kochi', 'Ernakulam', 'Kerala', 'city'],
  ['thiruvananthapuram', 'Thiruvananthapuram', 8.5241, 76.9366, 'Thiruvananthapuram', 'Thiruvananthapuram', 'Kerala', 'city'],
  ['coimbatore', 'Coimbatore', 11.0168, 76.9558, 'Coimbatore', 'Coimbatore', 'Tamil Nadu', 'city'],
  ['madurai', 'Madurai', 9.9252, 78.1198, 'Madurai', 'Madurai', 'Tamil Nadu', 'city'],
  ['mysuru', 'Mysuru', 12.2958, 76.6394, 'Mysuru', 'Mysuru', 'Karnataka', 'city'],
  ['mangalanu', 'Mangaluru', 12.9141, 74.8560, 'Mangaluru', 'Dakshina Kannada', 'Karnataka', 'city'],
  
  // Airports
  ['rajiv gandhi international airport', 'Rajiv Gandhi International Airport', 17.2403, 78.4294, 'Shamshabad', 'Rangareddy', 'Telangana', 'airport'],
  ['hyderabad airport', 'Hyderabad Airport', 17.2403, 78.4294, 'Shamshabad', 'Rangareddy', 'Telangana', 'airport'],
  ['bengaluru airport', 'Bengaluru Airport', 13.1986, 77.7066, 'Devanahalli', 'Bengaluru', 'Karnataka', 'airport'],
  ['charminar', 'Charminar', 17.3616, 78.4747, 'Charminar', 'Hyderabad', 'Telangana', 'landmark'],

  // West India Major Cities
  ['mumbai', 'Mumbai', 19.0760, 72.8777, 'Mumbai', 'Mumbai City', 'Maharashtra', 'city'],
  ['pune', 'Pune', 18.5204, 73.8567, 'Pune', 'Pune', 'Maharashtra', 'city'],
  ['nagpur', 'Nagpur', 21.1458, 79.0882, 'Nagpur', 'Nagpur', 'Maharashtra', 'city'],
  ['nashik', 'Nashik', 19.9975, 73.7898, 'Nashik', 'Nashik', 'Maharashtra', 'city'],
  ['ahmedabad', 'Ahmedabad', 23.0225, 72.5714, 'Ahmedabad', 'Ahmedabad', 'Gujarat', 'city'],
  ['surat', 'Surat', 21.1702, 72.8311, 'Surat', 'Surat', 'Gujarat', 'city'],
  ['vadodara', 'Vadodara', 22.3072, 73.1812, 'Vadodara', 'Vadodara', 'Gujarat', 'city'],
  ['rajkot', 'Rajkot', 22.3039, 70.8022, 'Rajkot', 'Rajkot', 'Gujarat', 'city'],
  ['goa', 'Goa', 15.2993, 74.1240, 'Goa', 'South Goa', 'Goa', 'city'],

  // East India Major Cities
  ['kolkata', 'Kolkata', 22.5726, 88.3639, 'Kolkata', 'Kolkata', 'West Bengal', 'city'],
  ['bhubaneswar', 'Bhubaneswar', 20.2961, 85.8245, 'Bhubaneswar', 'Khordha', 'Odisha', 'city'],
  ['cuttack', 'Cuttack', 20.4625, 85.8830, 'Cuttack', 'Cuttack', 'Odisha', 'city'],
  ['patna', 'Patna', 25.5941, 85.1376, 'Patna', 'Patna', 'Bihar', 'city'],
  ['ranchi', 'Ranchi', 23.3441, 85.3096, 'Ranchi', 'Ranchi', 'Jharkhand', 'city'],
  ['jamshedpur', 'Jamshedpur', 22.8046, 86.2029, 'Jamshedpur', 'East Singhbhum', 'Jharkhand', 'city'],
  ['guwahati', 'Guwahati', 26.1158, 91.7086, 'Guwahati', 'Kamrup Metropolitan', 'Assam', 'city'],
  ['siliguri', 'Siliguri', 26.7271, 88.3953, 'Siliguri', 'Darjeeling', 'West Bengal', 'city'],

  // Central India Major Cities
  ['bhopal', 'Bhopal', 23.2599, 77.4126, 'Bhopal', 'Bhopal', 'Madhya Pradesh', 'city'],
  ['indore', 'Indore', 22.7196, 75.8577, 'Indore', 'Indore', 'Madhya Pradesh', 'city'],
  ['gwalior', 'Gwalior', 26.2183, 78.1828, 'Gwalior', 'Gwalior', 'Madhya Pradesh', 'city'],
  ['jabalpur', 'Jabalpur', 23.1815, 79.9864, 'Jabalpur', 'Jabalpur', 'Madhya Pradesh', 'city'],
  ['raipur', 'Raipur', 21.2514, 81.6296, 'Raipur', 'Raipur', 'Chhattisgarh', 'city'],
  ['bilaspur', 'Bilaspur', 22.0796, 82.1391, 'Bilaspur', 'Bilaspur', 'Chhattisgarh', 'city'],
];

for (const loc of sampleLocations) {
  insertLocation.run(...loc);
}

// Seed intercity segments
const insertSegment = db.prepare(`
  INSERT INTO segments (id, from_location, to_location, mode, operator, duration_minutes, distance_km, price, departure_time, arrival_time, train_name, train_number, service_name, stops)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const sampleSegments = [
  // West Godavari to Vijayawada
  ['BHM-VJA-T1', 'Bhimavaram Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 145, 110.0, 145, '16:10', '18:35', 'Godavari Express', '12727', null, 'Tanuku, Eluru'],
  ['BHM-VJA-T2', 'Bhimavaram Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 145, 110.0, 145, '16:20', '18:45', 'Ratnachal Express', '12717', null, 'Tanuku, Eluru'],
  ['BHM-VJA-T3', 'Bhimavaram Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 135, 110.0, 420, '07:10', '09:25', 'Vande Bharat Express', '20833', null, 'Eluru'],
  ['BHM-VJA-T4', 'Bhimavaram Junction', 'Vijayawada Junction', 'train', 'Indian Railways', 145, 110.0, 145, '16:10', '18:35', 'Godavari Express', '12727', null, 'Tanuku, Eluru'],
  ['BHM-VJA-T5', 'Bhimavaram Junction', 'Vijayawada Junction', 'train', 'Indian Railways', 145, 110.0, 145, '16:20', '18:45', 'Ratnachal Express', '12717', null, 'Tanuku, Eluru'],

  ['BHM-VJA-B1', 'Bhimavaram Bus Station', 'Vijayawada Bus Station', 'bus', 'APSRTC', 185, 115.0, 240, '15:15', '18:20', null, null, 'Ultra Deluxe', 'Tanuku, Eluru'],
  ['BHM-VJA-B2', 'Bhimavaram Bus Station', 'Vijayawada Bus Station', 'bus', 'APSRTC', 195, 115.0, 180, '14:30', '17:45', null, null, 'Express', 'Tanuku, Tadepalligudem, Eluru'],
  ['BHM-VJA-B3', 'Bhimavaram Bus Station', 'Vijayawada Bus Station', 'bus', 'APSRTC', 250, 115.0, 140, '06:00', '10:10', null, null, 'Pallevelugu', 'Undi, Pippara, Tanuku, Eluru'],
  ['BHM-VJA-B4', 'Bhimavaram Bus Station', 'Vijayawada Bus Station', 'bus', 'APSRTC', 170, 115.0, 320, '10:00', '12:50', null, null, 'Super Luxury', 'Tadepalligudem, Eluru'],

  // Visakhapatnam to Vijayawada
  ['VSKP-VJA-T1', 'Visakhapatnam Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 360, 350.0, 220, '06:00', '12:00', 'Janmabhoomi Express', '12805', null, 'Samalkot, Rajahmundry, Eluru'],
  ['VSKP-VJA-T2', 'Visakhapatnam Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 330, 350.0, 550, '14:30', '20:00', 'Vande Bharat Express', '20833', null, 'Rajahmundry'],
  ['VSKP-VJA-B1', 'Dwaraka Bus Complex', 'Vijayawada Bus Station', 'bus', 'APSRTC', 480, 355.0, 520, '08:00', '16:00', null, null, 'Super Luxury', 'Anakapalli, Tuni, Kakinada, Rajahmundry, Eluru'],
  ['VSKP-VJA-B2', 'Dwaraka Bus Complex', 'Vijayawada Bus Station', 'bus', 'APSRTC', 460, 355.0, 680, '22:00', '05:40', null, null, 'Vennela Sleeper', 'Rajahmundry, Eluru'],

  // Rajahmundry to Vijayawada
  ['RJY-VJA-T1', 'Rajahmundry Railway Station', 'Vijayawada Railway Station', 'train', 'Indian Railways', 150, 150.0, 150, '14:00', '16:30', 'Simhadri Express', '17239', null, 'Nidadavolu, Tadepalligudem, Eluru'],
  ['RJY-VJA-B1', 'Rajahmundry Bus Station', 'Vijayawada Bus Station', 'bus', 'APSRTC', 180, 155.0, 220, '10:00', '13:00', null, null, 'Express', 'Kovvur, Tanuku, Tadepalligudem, Eluru'],
];

for (const seg of sampleSegments) {
  insertSegment.run(...seg);
}

// User helper statements
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserByIdentifier = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?');
const createUser = db.prepare(
  'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)'
);
const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');
const getLastId = db.prepare('SELECT last_insert_rowid() as id');

// Seed test user account if not exists
const testUser = findUserByEmail.get('pulagorlalakshmi8@gmail.com');
if (!testUser) {
  bcrypt.hash('password123', 10).then(hashed => {
    createUser.run('lakshmi', 'pulagorlalakshmi8@gmail.com', '7569636588', hashed);
  });
}

// Session store
const sessions = new Map();

// Authentication API
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existingUser = findUserByEmail.get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'You are already a user, so sign in' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    createUser.run(name, email, phone, hashedPassword);
    const userId = getLastId.get().id;
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, { userId, email, name });
    return res.status(201).json({
      message: 'User registered successfully',
      sessionId,
      user: { id: userId, name, email, phone }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Signup error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = findUserByIdentifier.get(identifier, identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }
    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, { userId: user.id, email: user.email, name: user.name });
    return res.status(200).json({
      message: 'Login successful',
      sessionId,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Login error' });
  }
});

app.get('/api/auth/profile/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(401).json({ error: 'Invalid session' });
  const user = getUserById.get(session.userId);
  return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

app.put('/api/auth/profile/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(401).json({ error: 'Invalid session' });
  const { name, email, phone } = req.body;
  db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?').run(name, email, phone, session.userId);
  sessions.set(req.params.sessionId, { ...session, email, name });
  return res.status(200).json({ user: { id: session.userId, name, email, phone } });
});

app.post('/api/auth/logout/:sessionId', (req, res) => {
  sessions.delete(req.params.sessionId);
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Haversine Distance helper
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatTime(minutesTotal) {
  const hours = Math.floor((minutesTotal / 60) % 24);
  const minutes = Math.floor(minutesTotal % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function calculateSegmentPrice(mode, basePrice, passengers) {
  if (mode === 'train' || mode === 'bus') {
    return basePrice * passengers;
  }
  return basePrice;
}

// Multi-Modal Pathfinding Connection Engine (covers AP Village + Indian Cities)
function findMultiModalRoutes(fromCity, toCity, date, timeStr, passengersCount) {
  const normalizedFrom = fromCity.trim().toLowerCase();
  const normalizedTo = toCity.trim().toLowerCase();
  const passengers = parseInt(passengersCount) || 1;

  // Same Location check
  if (normalizedFrom === normalizedTo) {
    return [];
  }

  // 1. Resolve locations (using loose matches first)
  let locFrom = db.prepare("SELECT * FROM locations WHERE LOWER(name) = ? OR id = ? OR LOWER(name) LIKE ?").get(normalizedFrom, normalizedFrom, `%${normalizedFrom}%`);
  let locTo = db.prepare("SELECT * FROM locations WHERE LOWER(name) = ? OR id = ? OR LOWER(name) LIKE ?").get(normalizedTo, normalizedTo, `%${normalizedTo}%`);

  // If not found in database, insert dynamic mock coordinate markers
  if (!locFrom) {
    locFrom = {
      id: normalizedFrom,
      name: fromCity,
      latitude: 16.5449,
      longitude: 81.5224,
      mandal: fromCity,
      district: 'West Godavari',
      state: 'Andhra Pradesh',
      type: 'village'
    };
    db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      locFrom.id, locFrom.name, locFrom.latitude, locFrom.longitude, locFrom.mandal, locFrom.district, locFrom.state, locFrom.type
    );
  }

  if (!locTo) {
    locTo = {
      id: normalizedTo,
      name: toCity,
      latitude: 16.5062,
      longitude: 80.6480,
      mandal: toCity,
      district: 'NTR',
      state: 'Andhra Pradesh',
      type: 'city'
    };
    db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      locTo.id, locTo.name, locTo.latitude, locTo.longitude, locTo.mandal, locTo.district, locTo.state, locTo.type
    );
  }

  const isFromHub = locFrom.type === 'station' || locFrom.type === 'bus' || locFrom.type === 'airport';
  const isToHub = locTo.type === 'station' || locTo.type === 'bus' || locTo.type === 'airport';

  // Fetch stations and bus hubs
  const stations = db.prepare("SELECT * FROM locations WHERE type = 'station'").all();
  const buses = db.prepare("SELECT * FROM locations WHERE type = 'bus'").all();

  // Helper to find nearest target using Haversine
  function findNearest(origin, targets) {
    if (targets.length === 0) return { target: null, distance: Infinity };
    let nearest = targets[0];
    let minDist = Infinity;
    for (const target of targets) {
      const d = getDistance(origin.latitude, origin.longitude, target.latitude, target.longitude);
      if (d < minDist) {
        minDist = d;
        nearest = target;
      }
    }
    return { target: nearest, distance: minDist };
  }

  // Get nearest start and destination hubs, dynamically generating hubs if the closest seeded one is too far (>50km)
  let startStations;
  if (isFromHub) {
    startStations = [locFrom];
  } else {
    const near = findNearest(locFrom, stations);
    if (near.distance > 50) {
      const nStation = {
        id: `${normalizedFrom}-station`,
        name: `${locFrom.name} Railway Station`,
        latitude: locFrom.latitude - 0.005,
        longitude: locFrom.longitude - 0.005,
        mandal: locFrom.mandal,
        district: locFrom.district,
        state: locFrom.state,
        type: 'station'
      };
      db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        nStation.id, nStation.name, nStation.latitude, nStation.longitude, nStation.mandal, nStation.district, nStation.state, nStation.type
      );
      startStations = [nStation];
    } else {
      startStations = [near.target];
    }
  }

  let startBuses;
  if (isFromHub) {
    startBuses = [locFrom];
  } else {
    const near = findNearest(locFrom, buses);
    if (near.distance > 50) {
      const nBus = {
        id: `${normalizedFrom}-bus`,
        name: `${locFrom.name} Bus Station`,
        latitude: locFrom.latitude + 0.005,
        longitude: locFrom.longitude + 0.005,
        mandal: locFrom.mandal,
        district: locFrom.district,
        state: locFrom.state,
        type: 'bus'
      };
      db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        nBus.id, nBus.name, nBus.latitude, nBus.longitude, nBus.mandal, nBus.district, nBus.state, nBus.type
      );
      startBuses = [nBus];
    } else {
      startBuses = [near.target];
    }
  }

  let destStations;
  if (isToHub) {
    destStations = [locTo];
  } else {
    const near = findNearest(locTo, stations);
    if (near.distance > 50) {
      const nStation = {
        id: `${normalizedTo}-station`,
        name: `${locTo.name} Railway Station`,
        latitude: locTo.latitude - 0.005,
        longitude: locTo.longitude - 0.005,
        mandal: locTo.mandal,
        district: locTo.district,
        state: locTo.state,
        type: 'station'
      };
      db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        nStation.id, nStation.name, nStation.latitude, nStation.longitude, nStation.mandal, nStation.district, nStation.state, nStation.type
      );
      destStations = [nStation];
    } else {
      destStations = [near.target];
    }
  }

  let destBuses;
  if (isToHub) {
    destBuses = [locTo];
  } else {
    const near = findNearest(locTo, buses);
    if (near.distance > 50) {
      const nBus = {
        id: `${normalizedTo}-bus`,
        name: `${locTo.name} Bus Station`,
        latitude: locTo.latitude + 0.005,
        longitude: locTo.longitude + 0.005,
        mandal: locTo.mandal,
        district: locTo.district,
        state: locTo.state,
        type: 'bus'
      };
      db.prepare("INSERT OR IGNORE INTO locations (id, name, latitude, longitude, mandal, district, state, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        nBus.id, nBus.name, nBus.latitude, nBus.longitude, nBus.mandal, nBus.district, nBus.state, nBus.type
      );
      destBuses = [nBus];
    } else {
      destBuses = [near.target];
    }
  }

  const candidateRoutes = [];

  // Compile Direct Uber Option
  const directDist = getDistance(locFrom.latitude, locFrom.longitude, locTo.latitude, locTo.longitude);
  const directUberPrice = Math.max(100, Math.round(directDist * 12.0));
  const directUberDuration = Math.round(directDist * 1.3);

  candidateRoutes.push({
    id: `direct-uber-${Date.now()}-${Math.random()}`,
    from: locFrom.name,
    to: locTo.name,
    totalPrice: directUberPrice,
    totalDurationMinutes: directUberDuration,
    totalTransfers: 0,
    segments: [{
      mode: 'uber',
      provider: 'Uber Intercity',
      from: locFrom.name,
      to: locTo.name,
      durationMinutes: directUberDuration,
      distanceKm: Math.round(directDist * 10) / 10,
      price: directUberPrice,
      departure: null,
      arrival: null
    }]
  });

  // Local connection legs builder
  function getLocalLegs(fromPoint, toPoint) {
    const d = getDistance(fromPoint.latitude, fromPoint.longitude, toPoint.latitude, toPoint.longitude);
    const options = [];
    if (d === 0) return [];

    // Walking
    if (d <= 3) {
      options.push({
        mode: 'walking',
        provider: 'Walking',
        from: fromPoint.name,
        to: toPoint.name,
        durationMinutes: Math.round(d * 12),
        distanceKm: Math.round(d * 10) / 10,
        price: 0
      });
    }

    // Rapido
    if (d <= 12) {
      options.push({
        mode: 'rapido',
        provider: 'Rapido Bike',
        from: fromPoint.name,
        to: toPoint.name,
        durationMinutes: Math.max(5, Math.round(d * 2.5)),
        distanceKm: Math.round(d * 10) / 10,
        price: Math.max(30, Math.round(d * 8 + 20))
      });
    }

    // Uber Auto
    options.push({
      mode: 'uber',
      provider: 'Uber Auto',
      from: fromPoint.name,
      to: toPoint.name,
      durationMinutes: Math.max(5, Math.round(d * 3.0)),
      distanceKm: Math.round(d * 10) / 10,
      price: Math.max(50, Math.round(d * 15 + 40))
    });

    return options;
  }

  // Train combinations
  for (const sStart of startStations) {
    for (const sEnd of destStations) {
      let trainSeg = db.prepare("SELECT * FROM segments WHERE LOWER(from_location) = ? AND LOWER(to_location) = ? AND mode = 'train'").get(sStart.name.toLowerCase(), sEnd.name.toLowerCase());
      
      if (!trainSeg && sStart.name !== sEnd.name) {
        const dist = getDistance(sStart.latitude, sStart.longitude, sEnd.latitude, sEnd.longitude);
        const duration = Math.round(dist * 1.5);
        const price = Math.round(dist * 1.1);
        trainSeg = {
          id: `train-${sStart.id}-${sEnd.id}`,
          from_location: sStart.name,
          to_location: sEnd.name,
          mode: 'train',
          operator: 'Indian Railways',
          duration_minutes: duration,
          distance_km: dist,
          price: price,
          departure_time: '16:10',
          arrival_time: formatTime(16 * 60 + 10 + duration),
          train_name: 'Godavari Express',
          train_number: '12727',
          service_name: null,
          stops: 'Eluru'
        };
      }

      if (trainSeg) {
        const origLegs = locFrom.id === sStart.id ? [{ mode: 'none' }] : getLocalLegs(locFrom, sStart);
        const destLegs = locTo.id === sEnd.id ? [{ mode: 'none' }] : getLocalLegs(sEnd, locTo);

        for (const ol of origLegs) {
          for (const dl of destLegs) {
            const hasOrig = ol.mode !== 'none';
            const hasDest = dl.mode !== 'none';
            const segments = [];
            let p = 0;
            let dur = trainSeg.duration_minutes;
            let transfers = 0;

            if (hasOrig) {
              segments.push(ol);
              p += ol.price;
              dur += ol.durationMinutes;
              transfers++;
            }
            
            const pTrain = calculateSegmentPrice('train', trainSeg.price, passengers);
            segments.push({
              mode: 'train',
              provider: trainSeg.operator,
              from: trainSeg.from_location,
              to: trainSeg.to_location,
              durationMinutes: trainSeg.duration_minutes,
              distanceKm: Math.round(trainSeg.distance_km * 10) / 10,
              price: pTrain,
              departure: trainSeg.departure_time,
              arrival: trainSeg.arrival_time,
              trainName: trainSeg.train_name || 'Godavari Express',
              trainNumber: trainSeg.train_number || '12727',
              serviceName: trainSeg.service_name,
              stops: trainSeg.stops || 'Eluru'
            });
            p += pTrain;

            if (hasDest) {
              segments.push(dl);
              p += dl.price;
              dur += dl.durationMinutes;
              transfers++;
            }

            const buffer = (hasOrig ? 20 : 0) + (hasDest ? 10 : 0);

            candidateRoutes.push({
              id: `combo-train-${ol.mode}-${dl.mode}-${Date.now()}-${Math.random()}`,
              from: locFrom.name,
              to: locTo.name,
              totalPrice: p,
              totalDurationMinutes: dur + buffer,
              totalTransfers: transfers,
              segments
            });
          }
        }
      }
    }
  }

  // Bus combinations
  for (const bStart of startBuses) {
    for (const bEnd of destBuses) {
      let busSeg = db.prepare("SELECT * FROM segments WHERE LOWER(from_location) = ? AND LOWER(to_location) = ? AND mode = 'bus'").get(bStart.name.toLowerCase(), bEnd.name.toLowerCase());
      
      if (!busSeg && bStart.name !== bEnd.name) {
        const dist = getDistance(bStart.latitude, bStart.longitude, bEnd.latitude, bEnd.longitude);
        const duration = Math.round(dist * 1.8);
        const price = Math.round(dist * 1.5);
        busSeg = {
          id: `bus-${bStart.id}-${bEnd.id}`,
          from_location: bStart.name,
          to_location: bEnd.name,
          mode: 'bus',
          operator: 'APSRTC',
          duration_minutes: duration,
          distance_km: dist,
          price: price,
          departure_time: '15:15',
          arrival_time: formatTime(15 * 60 + 15 + duration),
          train_name: null,
          train_number: null,
          service_name: 'Express',
          stops: 'Eluru'
        };
      }

      if (busSeg) {
        const origLegs = locFrom.id === bStart.id ? [{ mode: 'none' }] : getLocalLegs(locFrom, bStart);
        const destLegs = locTo.id === bEnd.id ? [{ mode: 'none' }] : getLocalLegs(bEnd, locTo);

        for (const ol of origLegs) {
          for (const dl of destLegs) {
            const hasOrig = ol.mode !== 'none';
            const hasDest = dl.mode !== 'none';
            const segments = [];
            let p = 0;
            let dur = busSeg.duration_minutes;
            let transfers = 0;

            if (hasOrig) {
              segments.push(ol);
              p += ol.price;
              dur += ol.durationMinutes;
              transfers++;
            }
            
            const pBus = calculateSegmentPrice('bus', busSeg.price, passengers);
            segments.push({
              mode: 'bus',
              provider: busSeg.operator,
              from: busSeg.from_location,
              to: busSeg.to_location,
              durationMinutes: busSeg.duration_minutes,
              distanceKm: Math.round(busSeg.distance_km * 10) / 10,
              price: pBus,
              departure: busSeg.departure_time,
              arrival: busSeg.arrival_time,
              trainName: busSeg.train_name,
              trainNumber: busSeg.train_number,
              serviceName: busSeg.service_name || 'Express',
              stops: busSeg.stops || 'Eluru'
            });
            p += pBus;

            if (hasDest) {
              segments.push(dl);
              p += dl.price;
              dur += dl.durationMinutes;
              transfers++;
            }

            const buffer = (hasOrig ? 15 : 0) + (hasDest ? 10 : 0);

            candidateRoutes.push({
              id: `combo-bus-${ol.mode}-${dl.mode}-${Date.now()}-${Math.random()}`,
              from: locFrom.name,
              to: locTo.name,
              totalPrice: p,
              totalDurationMinutes: dur + buffer,
              totalTransfers: transfers,
              segments
            });
          }
        }
      }
    }
  }

  // Direct Option matches check
  if (isFromHub && isToHub) {
    let directSeg = db.prepare("SELECT * FROM segments WHERE LOWER(from_location) = ? AND LOWER(to_location) = ?").all(normalizedFrom, normalizedTo);
    for (const d of directSeg) {
      const pSeg = calculateSegmentPrice(d.mode, d.price, passengers);
      candidateRoutes.push({
        id: `direct-${d.id}-${Date.now()}`,
        from: locFrom.name,
        to: locTo.name,
        totalPrice: pSeg,
        totalDurationMinutes: d.duration_minutes,
        totalTransfers: 0,
        segments: [{
          mode: d.mode,
          provider: d.operator,
          from: d.from_location,
          to: d.to_location,
          durationMinutes: d.duration_minutes,
          distanceKm: Math.round(d.distance_km * 10) / 10,
          price: pSeg,
          departure: d.departure_time,
          arrival: d.arrival_time,
          trainName: d.train_name,
          trainNumber: d.train_number,
          serviceName: d.service_name,
          stops: d.stops
        }]
      });
    }
  }

  // 6. Scoring & Tagging
  if (candidateRoutes.length > 0) {
    candidateRoutes.forEach(r => r.tag = null);

    // Cheapest
    candidateRoutes.sort((a, b) => a.totalPrice - b.totalPrice);
    const cheapestPrice = candidateRoutes[0].totalPrice;
    candidateRoutes.forEach(r => {
      if (r.totalPrice === cheapestPrice) r.tag = 'cheapest';
    });

    // Fastest
    candidateRoutes.sort((a, b) => a.totalDurationMinutes - b.totalDurationMinutes);
    const fastestDuration = candidateRoutes[0].totalDurationMinutes;
    candidateRoutes.forEach(r => {
      if (r.totalDurationMinutes === fastestDuration) {
        r.tag = r.tag ? 'cheapest' : 'fastest'; 
      }
    });

    // Best Overall Score
    const maxPrice = Math.max(...candidateRoutes.map(r => r.totalPrice));
    const minPrice = Math.min(...candidateRoutes.map(r => r.totalPrice));
    const maxDur = Math.max(...candidateRoutes.map(r => r.totalDurationMinutes));
    const minDur = Math.min(...candidateRoutes.map(r => r.totalDurationMinutes));

    candidateRoutes.forEach(r => {
      const normPrice = maxPrice === minPrice ? 0 : (r.totalPrice - minPrice) / (maxPrice - minPrice);
      const normDur = maxDur === minDur ? 0 : (r.totalDurationMinutes - minDur) / (maxDur - minDur);
      const transfersPenalty = r.totalTransfers * 0.3;
      r.score = normPrice * 0.4 + normDur * 0.4 + transfersPenalty * 0.2;
    });

    candidateRoutes.sort((a, b) => a.score - b.score);
    const bestRoute = candidateRoutes[0];
    if (bestRoute) {
      bestRoute.tag = 'best';
    }

    candidateRoutes.forEach(r => {
      if (r.tag !== 'best' && r.tag !== 'cheapest' && r.tag !== 'fastest') {
        r.tag = null;
      }
    });
  }

  return candidateRoutes;
}

// REST Routes
app.get('/api/planner', (req, res) => {
  try {
    const { from, to, date, time, passengers } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to locations are required' });
    }
    
    // Check same location validation
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      return res.status(400).json({ error: 'Your starting point and destination are the same. Please select different locations.' });
    }

    const routes = findMultiModalRoutes(from, to, date, time, passengers);
    return res.status(200).json({ routes });
  } catch (error) {
    console.error('Planner error:', error);
    return res.status(500).json({ error: 'Server error generating travel plan' });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`RouteConnect server running on http://localhost:${PORT}`);
});
