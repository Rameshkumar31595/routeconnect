// Static Airport Infrastructure & Regional Ground Feeder Links
// Authoritative dataset of commercial airports and intermodal airport transit connections.

export const COMMERCIAL_AIRPORTS = [
  {
    iata: 'VGA',
    name: 'Vijayawada International Airport',
    displayName: 'Vijayawada Airport (VGA)',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    latitude: 16.5310,
    longitude: 80.7960,
    terminals: ['T1 (Domestic)'],
    feederOptions: [
      { mode: 'bus', provider: 'APSRTC Airport Express Shuttle', durationMinutes: 40, price: 120, distanceKm: 21 },
      { mode: 'cab', provider: 'Prepaid Airport Taxi', durationMinutes: 30, price: 550, distanceKm: 21 }
    ]
  },
  {
    iata: 'HYD',
    name: 'Rajiv Gandhi International Airport',
    displayName: 'Hyderabad Airport (HYD)',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.2403,
    longitude: 78.4294,
    terminals: ['Main Terminal'],
    feederOptions: [
      { mode: 'bus', provider: 'Pushpak Airport Liner (TSRTC)', durationMinutes: 55, price: 250, distanceKm: 32 },
      { mode: 'cab', provider: 'Airport Taxi / Cab Shuttle', durationMinutes: 45, price: 850, distanceKm: 32 }
    ]
  },
  {
    iata: 'BLR',
    name: 'Kempegowda International Airport',
    displayName: 'Bengaluru Airport (BLR)',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 13.1986,
    longitude: 77.7066,
    terminals: ['T1', 'T2'],
    feederOptions: [
      { mode: 'bus', provider: 'BMTC Vayu Vajra Airport Express', durationMinutes: 65, price: 280, distanceKm: 38 },
      { mode: 'train', provider: 'Airport Halt Railway Suburban Line', durationMinutes: 50, price: 35, distanceKm: 35 },
      { mode: 'cab', provider: 'Airport Taxi Shuttle', durationMinutes: 55, price: 950, distanceKm: 38 }
    ]
  },
  {
    iata: 'MAA',
    name: 'Chennai International Airport',
    displayName: 'Chennai Airport (MAA)',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 12.9941,
    longitude: 80.1709,
    terminals: ['T1 (Domestic)', 'T4 (Domestic)'],
    feederOptions: [
      { mode: 'train', provider: 'Chennai Metro Airport Line', durationMinutes: 35, price: 50, distanceKm: 18 },
      { mode: 'bus', provider: 'MTC Airport Feeder Bus', durationMinutes: 45, price: 60, distanceKm: 18 },
      { mode: 'cab', provider: 'Prepaid Airport Cab', durationMinutes: 35, price: 450, distanceKm: 18 }
    ]
  },
  {
    iata: 'TIR',
    name: 'Tirupati International Airport',
    displayName: 'Tirupati Airport (TIR)',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    latitude: 13.6325,
    longitude: 79.5433,
    terminals: ['Garuda Terminal'],
    feederOptions: [
      { mode: 'bus', provider: 'APSRTC Airport Link Shuttle', durationMinutes: 35, price: 90, distanceKm: 15 },
      { mode: 'cab', provider: 'Airport Taxi', durationMinutes: 25, price: 450, distanceKm: 15 }
    ]
  },
  {
    iata: 'VTZ',
    name: 'Visakhapatnam International Airport',
    displayName: 'Visakhapatnam Airport (VTZ)',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    latitude: 17.7210,
    longitude: 83.2240,
    terminals: ['Integrated Terminal'],
    feederOptions: [
      { mode: 'bus', provider: 'APSRTC City Airport Route', durationMinutes: 30, price: 45, distanceKm: 12 },
      { mode: 'cab', provider: 'Prepaid Airport Taxi', durationMinutes: 25, price: 380, distanceKm: 12 }
    ]
  },
  {
    iata: 'RJA',
    name: 'Rajahmundry Airport',
    displayName: 'Rajahmundry Airport (RJA)',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    latitude: 17.1106,
    longitude: 81.8183,
    terminals: ['Main Terminal'],
    feederOptions: [
      { mode: 'bus', provider: 'APSRTC Feeder Bus', durationMinutes: 35, price: 50, distanceKm: 18 },
      { mode: 'cab', provider: 'Airport Cab Service', durationMinutes: 30, price: 450, distanceKm: 18 }
    ]
  },
  {
    iata: 'DEL',
    name: 'Indira Gandhi International Airport',
    displayName: 'Delhi Airport (DEL)',
    city: 'Delhi',
    state: 'Delhi NCR',
    latitude: 28.5562,
    longitude: 77.1000,
    terminals: ['T1', 'T2', 'T3'],
    feederOptions: [
      { mode: 'train', provider: 'Delhi Metro Airport Express', durationMinutes: 25, price: 60, distanceKm: 22 },
      { mode: 'cab', provider: 'Airport Prepaid Cab', durationMinutes: 40, price: 650, distanceKm: 22 }
    ]
  },
  {
    iata: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    displayName: 'Mumbai Airport (BOM)',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0896,
    longitude: 72.8656,
    terminals: ['T1', 'T2'],
    feederOptions: [
      { mode: 'train', provider: 'Mumbai Metro Line 3 / Suburban Rail', durationMinutes: 30, price: 40, distanceKm: 15 },
      { mode: 'cab', provider: 'Prepaid Taxi', durationMinutes: 40, price: 550, distanceKm: 15 }
    ]
  }
];

// Regional Ground Feeder Connectors (Panchayati / Intercity transport from rural & urban nodes to airports)
export const REGIONAL_AIRPORT_FEEDERS = [
  // Village A / Ongole / Bapatla / Town B to Nearby Airports
  {
    fromLocation: 'Village A',
    toAirportIata: 'HYD',
    mode: 'bus',
    provider: 'APSRTC Express Airport Link',
    distanceKm: 45.0,
    durationMinutes: 60,
    price: 180,
    departureTime: '08:30',
    arrivalTime: '09:30',
    via: 'Express Highway',
    notes: 'Direct 45 km bus connecting Village A to Hyderabad Airport.'
  },
  {
    fromLocation: 'Village A',
    toAirportIata: 'VGA',
    mode: 'bus',
    provider: 'APSRTC Palle Velugu & Express Airport Feeder',
    distanceKm: 135.0,
    durationMinutes: 165,
    price: 240,
    departureTime: '06:00',
    arrivalTime: '08:45',
    via: 'Town B Bus Stand & Vijayawada Bus Station',
    notes: 'Board Palle Velugu feeder to Town B, connect via Express to Vijayawada Airport.'
  },
  {
    fromLocation: 'Village A',
    toAirportIata: 'VGA',
    mode: 'cab',
    provider: 'Intercity Airport Taxi Shuttle',
    distanceKm: 135.0,
    durationMinutes: 135,
    price: 1850,
    departureTime: '06:30',
    arrivalTime: '08:45',
    via: 'NH 16 Grand Trunk Corridor',
    notes: 'Direct outstation door-to-terminal cab to Vijayawada Airport (VGA).'
  },
  {
    fromLocation: 'Village A',
    toAirportIata: 'HYD',
    mode: 'bus',
    provider: 'APSRTC Super Luxury & Pushpak Airport Liner',
    distanceKm: 285.0,
    durationMinutes: 310,
    price: 520,
    departureTime: '04:30',
    arrivalTime: '09:40',
    via: 'Chilakaluripeta & Guntur & Shamshabad',
    notes: 'Early morning express coach connecting to Rajiv Gandhi International Airport.'
  },
  {
    fromLocation: 'Village A',
    toAirportIata: 'TIR',
    mode: 'train',
    provider: 'South Central Railway & Airport Shuttle',
    distanceKm: 220.0,
    durationMinutes: 240,
    price: 190,
    departureTime: '05:45',
    arrivalTime: '09:45',
    via: 'Ongole Railway Station & Renigunta Junction',
    notes: 'Intercity rail to Renigunta, 15 min shuttle to Tirupati Airport.'
  },
  {
    fromLocation: 'Ongole',
    toAirportIata: 'VGA',
    mode: 'bus',
    provider: 'APSRTC Non-Stop Airport Express',
    distanceKm: 145.0,
    durationMinutes: 150,
    price: 260,
    departureTime: '06:15',
    arrivalTime: '08:45',
    via: 'Chilakaluripeta & Vijayawada Bypass',
    notes: 'Direct RTC express to Vijayawada Airport (Gannavaram).'
  },
  {
    fromLocation: 'Bhimavaram',
    toAirportIata: 'VGA',
    mode: 'bus',
    provider: 'APSRTC Ultra Deluxe Airport Service',
    distanceKm: 98.0,
    durationMinutes: 120,
    price: 190,
    departureTime: '06:30',
    arrivalTime: '08:30',
    via: 'Gudivada & Pamarru',
    notes: 'Direct connecting bus to Vijayawada Airport.'
  },
  {
    fromLocation: 'Bhimavaram',
    toAirportIata: 'RJA',
    mode: 'bus',
    provider: 'APSRTC Express',
    distanceKm: 75.0,
    durationMinutes: 95,
    price: 140,
    departureTime: '07:00',
    arrivalTime: '08:35',
    via: 'Tanuku & Kovvur',
    notes: 'Direct connecting bus to Rajahmundry Airport.'
  },
  {
    fromLocation: 'Vijayawada',
    toAirportIata: 'VGA',
    mode: 'bus',
    provider: 'APSRTC Airport Express',
    distanceKm: 21.0,
    durationMinutes: 40,
    price: 120,
    departureTime: 'Every 30 mins',
    arrivalTime: null,
    via: 'MG Road & Benz Circle',
    notes: 'City shuttle from PNBS to Airport Terminal.'
  },

  // Airport to Final Destination Ground Links
  {
    fromAirportIata: 'BLR',
    toLocation: 'City B',
    mode: 'bus',
    provider: 'KSRTC Rajahamsa / Airawat Feeder',
    distanceKm: 55.0,
    durationMinutes: 65,
    price: 180,
    departureTime: '11:00',
    arrivalTime: '12:05',
    via: 'Hebbal & Outer Ring Road',
    notes: 'Airport connecting express bus directly to City B center.'
  },
  {
    fromAirportIata: 'BLR',
    toLocation: 'City B',
    mode: 'train',
    provider: 'Bengaluru Suburban Railway',
    distanceKm: 48.0,
    durationMinutes: 50,
    price: 45,
    departureTime: '11:15',
    arrivalTime: '12:05',
    via: 'KIA Airport Halt & Yesvantpur Junction',
    notes: 'Suburban train connection from Airport Halt station directly to City B.'
  },
  {
    fromAirportIata: 'BLR',
    toLocation: 'Bengaluru',
    mode: 'bus',
    provider: 'BMTC Vayu Vajra Airport Bus',
    distanceKm: 38.0,
    durationMinutes: 65,
    price: 280,
    departureTime: 'Every 15 mins',
    arrivalTime: null,
    via: 'Hebbal & MG Road',
    notes: 'Frequent AC airport shuttle to Kempegowda Bus Station / Majestic.'
  },
  {
    fromAirportIata: 'MAA',
    toLocation: 'City B',
    mode: 'train',
    provider: 'Southern Railway Intercity',
    distanceKm: 65.0,
    durationMinutes: 70,
    price: 85,
    departureTime: '11:30',
    arrivalTime: '12:40',
    via: 'Chennai Central & Tambaram',
    notes: 'Intercity train link from airport hub to City B destination.'
  },
  {
    fromAirportIata: 'HYD',
    toLocation: 'Hyderabad',
    mode: 'bus',
    provider: 'Pushpak Airport Liner',
    distanceKm: 32.0,
    durationMinutes: 55,
    price: 250,
    departureTime: 'Every 20 mins',
    arrivalTime: null,
    via: 'PVNR Expressway',
    notes: 'Direct shuttle to MGBS / Secunderabad.'
  },
  {
    fromAirportIata: 'DEL',
    toLocation: 'Delhi',
    mode: 'train',
    provider: 'Delhi Metro Airport Express',
    distanceKm: 22.0,
    durationMinutes: 25,
    price: 60,
    departureTime: 'Every 10 mins',
    arrivalTime: null,
    via: 'Dhaula Kuan & New Delhi Station',
    notes: 'High-speed metro to New Delhi city center.'
  }
];
