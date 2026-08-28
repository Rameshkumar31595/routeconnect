import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new DatabaseSync(path.join(__dirname, 'test.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

const createUser = db.prepare(
  'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)'
);
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');

const result = createUser.run('John Doe', 'john@example.com', '1234567890', 'hashedpassword');
console.log('Insert Result:', result);
console.log('lastInsertRowid:', result.lastInsertRowid);

const user = findUserByEmail.get('john@example.com');
console.log('Found User:', user);

// Cleanup
db.exec('DROP TABLE users');
