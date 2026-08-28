# RouteConnect - Complete Setup & Implementation Guide

## Project Overview
This is a complete implementation of the RouteConnect website with:
- ✅ Modern lavender-based color palette
- ✅ User authentication (Sign Up & Sign In)
- ✅ SQL database integration with password hashing
- ✅ User profile management with edit functionality
- ✅ Responsive design for all devices
- ✅ Secure session management

---

## 📁 Project Structure

```
SE/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           (Updated with lavender colors & user dropdown)
│   │   ├── SearchCard.tsx       (Updated with lavender palette)
│   │   ├── LocationInput.tsx    (Updated with lavender design)
│   │   ├── RouteCard.tsx        (Updated with lavender theme)
│   │   ├── LoadingState.tsx     (Updated with lavender colors)
│   │   └── AuthForm.tsx
│   ├── pages/
│   │   ├── Login.tsx            (✨ New lavender theme, no "remember me")
│   │   ├── Signup.tsx           (✨ New with phone field & lavender)
│   │   ├── Dashboard.tsx        (✨ Major: Prominent RouteConnect title)
│   │   └── Profile.tsx          (✨ New: Full profile with edit capability)
│   ├── context/
│   │   └── AuthContext.tsx      (✨ Updated to use backend API)
│   ├── services/
│   │   └── routeService.ts
│   ├── App.tsx
│   ├── index.css                (✨ Updated lavender palette)
│   └── main.tsx
├── server.js                     (✨ NEW: Express backend with SQLite)
├── package.json                  (✨ Updated with backend dependencies)
├── vite.config.ts               (✨ Added API proxy)
├── tailwind.config.js           (✨ Updated with lavender colors)
├── tsconfig.json
├── index.html
└── .env                         (✨ NEW: Environment variables)
```

---

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd c:\Users\pulag\OneDrive\Desktop\SE
npm install
```
**Note**: The project uses the native `node:sqlite` module and pure-JS `bcryptjs`, which do not require native compilation tools (like Visual Studio C++ build tools) and will install very quickly.

### Step 2: Start the Development Servers

**In Terminal 1 - Start Backend Server:**
```bash
npm run server
```
You should see: `RouteConnect server running on http://localhost:5000`

**In Terminal 2 - Start Frontend Dev Server:**
```bash
npm run dev
```
The Vite server will start on `http://localhost:5173`

### Step 3: Access the Application
Open your browser to: **http://localhost:5173**

---

## 🎨 Color Palette

### Lavender Theme (Complete)
- **Primary**: `#a855f7` (Purple-500)
- **Primary Dark**: `#9333ea` (Purple-600)
- **Background**: `#f8f7fc` (Lavender-50)
- **Light Background**: `#ede9fe` (Purple-100)
- **Text**: `#581c87` (Purple-900)
- **Accent**: `#c4b5fd` (Purple-300)

All pages have been updated to use this lavender palette instead of the previous sky blue.

---

## 🔐 Authentication Flow

### Sign Up Process
1. User enters: Full Name, Email, Phone, Password, Confirm Password
2. Frontend validates input
3. Data sent to backend: `POST /api/auth/signup`
4. Backend checks for duplicate emails
5. Password hashed with bcrypt (10 rounds)
6. User data stored in SQLite database
7. Session created and stored
8. User redirected to Dashboard

### Sign In Process
1. User enters: Email and Password
2. Frontend validates input
3. Data sent to backend: `POST /api/auth/login`
4. Backend retrieves user from database
5. Password compared with stored hash
6. If valid: Session created, user redirected to Dashboard
7. If invalid: Error message displayed

### Session Management
- Session ID stored in localStorage
- User data stored in localStorage
- Logout clears both
- Protected routes checked via AuthContext

---

## 💾 Database Schema

### SQLite Database: `routeconnect.db`

**Users Table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

---

## 📝 API Endpoints

### POST `/api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "password": "secure_password",
  "confirmPassword": "secure_password"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "sessionId": "abc123xyz",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567"
  }
}
```

### POST `/api/auth/login`
Authenticate an existing user
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### GET `/api/auth/profile/:sessionId`
Get user profile

### PUT `/api/auth/profile/:sessionId`
Update user profile
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "phone": "+1 (555) 987-6543"
}
```

### POST `/api/auth/logout/:sessionId`
Logout user (clears session)

---

## 🎯 Key Features Implemented

### ✅ Frontend Features
- [x] Lavender color palette throughout
- [x] Responsive design (mobile, tablet, desktop)
- [x] Modern, clean UI with rounded corners
- [x] Sign Up page with phone field
- [x] Sign In page (no "remember me")
- [x] User profile dropdown in navbar
- [x] Profile page with edit functionality
- [x] User details view (Name, Email, Phone)
- [x] Logout functionality
- [x] Prominent "RouteConnect" title on dashboard
- [x] Error messages for authentication failures
- [x] Loading states during API calls

### ✅ Backend Features
- [x] Express.js server
- [x] SQLite database
- [x] Password hashing with bcrypt
- [x] Duplicate email prevention
- [x] Session management
- [x] CORS enabled
- [x] Input validation
- [x] Error handling

### ✅ User Experience
- [x] Sign Up → SQL Database → Sign In → Dashboard
- [x] Secure password storage
- [x] Profile management and editing
- [x] Top-right user dropdown menu
- [x] Smooth transitions and hover effects
- [x] Clear error messages
- [x] Loading indicators

---

## 🧪 Test Credentials

After the first user signs up, you can use those credentials to sign in.

**Example for testing:**
- Email: `test@example.com`
- Password: `password123`
- Phone: `+1 (555) 000-0000`
- Name: `Test User`

---

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** (320px - 640px): Single column, optimized touch targets
- **Tablet** (641px - 1024px): Adjusted spacing and layouts
- **Desktop** (1025px+): Full multi-column layouts

All navigation, forms, and content adapt seamlessly across all breakpoints.

---

## 🔧 Environment Variables

File: `.env`
```
PORT=5000
```

Change the `PORT` variable if needed, but ensure the Vite proxy in `vite.config.ts` matches.

---

## 🛠️ Troubleshooting

### Installation issues
- Make sure you are using Node.js v24.18.0. Since we use `node:sqlite` (built-in) and `bcryptjs` (pure JS), installation should be fast and not require any C++ build tools.

### Port 5000 already in use
```bash
# Change port in .env and vite.config.ts
PORT=5001
```

### Port 5173 already in use
```bash
# Vite will automatically try the next port (5174, 5175, etc.)
```

### Database errors
- SQLite database creates automatically on first run
- If issues persist, delete `routeconnect.db` and restart server

### Login/Signup errors
- Ensure backend server is running on port 5000
- Check console for error messages
- Verify email format (must contain @)
- Passwords must be at least 6 characters

---

## 📦 Dependencies

### Frontend
- React 18.3.1
- React Router DOM 6.15.0
- TypeScript 5.3.0
- Tailwind CSS 3.4.4
- Lucide React Icons 0.460.0
- Vite 5.0.0

### Backend
- node:sqlite (native Node.js module)
- bcryptjs 2.4.3
- CORS 2.8.5
- dotenv 16.3.1

---

## 🚀 Running in Production

For production deployment:

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Update backend for production:**
   - Use environment variables for database path
   - Add proper error logging
   - Enable HTTPS
   - Use secure session storage (Redis/Database)

3. **Deploy:**
   - Frontend: Deploy `dist/` folder to static hosting
   - Backend: Deploy `server.js` to Node.js hosting
   - Database: Use managed SQLite or migrate to PostgreSQL

---

## 📞 Support

For issues or questions:
1. Check the console for error messages
2. Verify all servers are running
3. Clear browser cache if styles aren't loading
4. Restart both servers

---

## ✨ File Changes Summary

### New Files
- [x] `server.js` - Express backend
- [x] `.env` - Environment configuration

### Updated Files  
- [x] `package.json` - Added backend dependencies
- [x] `src/context/AuthContext.tsx` - API integration
- [x] `src/pages/Login.tsx` - Lavender theme
- [x] `src/pages/Signup.tsx` - Phone field + lavender
- [x] `src/pages/Dashboard.tsx` - Prominent title + lavender
- [x] `src/pages/Profile.tsx` - Edit profile functionality
- [x] `src/components/Navbar.tsx` - User dropdown + lavender
- [x] `src/components/SearchCard.tsx` - Lavender theme
- [x] `src/components/LocationInput.tsx` - Lavender theme
- [x] `src/components/RouteCard.tsx` - Lavender theme
- [x] `src/components/LoadingState.tsx` - Lavender theme
- [x] `src/index.css` - Lavender background
- [x] `tailwind.config.js` - Lavender colors
- [x] `vite.config.ts` - API proxy

---

**Ready to build your RouteConnect app! 🚀 Happy coding!**
