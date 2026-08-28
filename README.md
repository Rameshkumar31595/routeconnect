# RouteConnect - Complete Website

A modern, secure travel route connection platform with user authentication, profile management, and a beautiful lavender-based design.

## ✨ Features

### 🔐 Authentication
- **Sign Up**: Register with full name, email, phone number, and password
- **Sign In**: Secure login with email validation
- **Password Security**: Bcrypt hashing (10 rounds) for secure storage
- **Session Management**: Secure session handling with localStorage
- **Duplicate Prevention**: Email-based duplicate account prevention

### 👤 User Profile
- **View Profile**: See all user details (name, email, phone)
- **Edit Profile**: Update name, email, and phone number
- **User Dropdown**: Top-right navbar dropdown with profile options
- **Logout**: Secure logout that clears session

### 🎨 Design
- **Lavender Palette**: Modern purple/lavender color scheme
- **Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Modern UI**: Rounded corners, smooth transitions, gradient buttons
- **Accessibility**: Good color contrast, intuitive navigation

### 📱 Pages
- **Login Page**: Beautiful sign-in form with lavender theme
- **Signup Page**: Registration with all required fields
- **Dashboard**: Prominent "RouteConnect" title, route search
- **Profile Page**: Full user profile with edit functionality
- **Navbar**: User dropdown menu in top-right corner

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd c:\Users\pulag\OneDrive\Desktop\SE
npm install
```
*Note: This may take 2-5 minutes due to native addon compilation*

### 2. Start Backend Server (Terminal 1)
```bash
npm run server
```
Backend runs on `http://localhost:5000`

### 3. Start Frontend Server (Terminal 2)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Open in Browser
Navigate to `http://localhost:5173`

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Page navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web server
- **SQLite** - Database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin support

## 📊 Database

### SQLite Schema
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

Passwords are hashed using bcrypt before storage.

## 🎨 Color Palette

Complete lavender theme applied throughout:
- Primary: Purple-500 (#a855f7)
- Dark: Purple-600 (#9333ea)  
- Light: Purple-100 (#ede9fe)
- Background: Lavender-50 (#f8f7fc)
- Text: Purple-900 (#581c87)

## 📂 Project Structure

```
src/
├── pages/
│   ├── Login.tsx       - Sign in page
│   ├── Signup.tsx      - Registration page
│   ├── Dashboard.tsx   - Main page with prominent title
│   └── Profile.tsx     - User profile with edit
├── components/
│   ├── Navbar.tsx      - Navigation with user dropdown
│   ├── SearchCard.tsx  - Route search form
│   ├── LocationInput.tsx
│   ├── RouteCard.tsx   - Route display card
│   └── LoadingState.tsx
├── context/
│   └── AuthContext.tsx - Authentication logic
└── services/
    └── routeService.ts
    
server.js             - Express backend
package.json          - Dependencies
tailwind.config.js    - Color configuration
vite.config.ts        - Frontend build config
```

## 🔑 API Endpoints

### POST `/api/auth/signup`
Register new user with validation

### POST `/api/auth/login`
Authenticate existing user

### GET `/api/auth/profile/:sessionId`
Get user profile data

### PUT `/api/auth/profile/:sessionId`
Update user information

### POST `/api/auth/logout/:sessionId`
End user session

## 🧪 Test the Application

### Sign Up
1. Navigate to `http://localhost:5173`
2. Click "Sign up" link
3. Fill in form with:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `+1 (555) 000-0000`
   - Password: `password123`
4. Submit

### Sign In
1. Use the email and password from signup
2. You'll be redirected to Dashboard
3. Click the user avatar in top-right to see profile options

### Edit Profile
1. After signing in, go to Dashboard
2. Click user avatar → "User Details"
3. Click "Edit Profile"
4. Update information and save

### Logout
1. Click user avatar in top-right
2. Select "Logout"
3. You'll be redirected to login page

## 📱 Responsive Design

- **Mobile** (320px+): Single column, touch-optimized
- **Tablet** (640px+): Multi-column where applicable
- **Desktop** (1024px+): Full layout with sidebar space

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Email validation
- ✅ Duplicate account prevention
- ✅ Session-based authentication
- ✅ CORS protection
- ✅ Input validation on frontend and backend

## 🎯 Workflow

```
New User → Sign Up → Database Storage → Sign In → Dashboard
                                            ↓
                                      View Profile
                                            ↓
                                      Edit Profile
                                            ↓
                                         Logout
```

## 📝 Form Validation

### Sign Up
- Name: Required, non-empty
- Email: Must contain @, unique
- Phone: Required
- Password: Minimum 6 characters
- Confirm: Must match password

### Sign In
- Email: Must contain @
- Password: Minimum 6 characters

### Edit Profile
- All fields required
- Email must be valid format

## 🚀 Performance

- Fast page loads with Vite
- Optimized images and assets
- Efficient API calls
- Smooth animations and transitions
- Mobile-first responsive design

## 💡 Key Implementation Details

### Authentication Context
The `AuthContext` manages:
- User state
- Session ID storage
- API communication
- Logout and profile updates

### Protected Routes
Dashboard and Profile pages require authentication via `ProtectedRoute` component.

### API Proxy
Vite proxies `/api` requests to `http://localhost:5000` in development.

## 🐛 Troubleshooting

### npm install errors
- Run `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Try again: `npm install`

### Backend won't start
- Check if port 5000 is available
- Restart the server
- Check error logs in terminal

### Login doesn't work
- Ensure backend is running on port 5000
- Check email format (must have @)
- Verify password is 6+ characters
- Check browser console for errors

### Styling issues
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Restart both servers

## 📚 Documentation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions and API documentation.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js Guide](https://expressjs.com)
- [SQLite Documentation](https://www.sqlite.org)
- [bcrypt Security](https://github.com/kelektiv/node.bcrypt.js)

## 📄 License

This project is ready for development and deployment.

---

**Built with ❤️ using React, Express, and Tailwind CSS**
