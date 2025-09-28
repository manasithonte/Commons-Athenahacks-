# 📚 Commons App - Study Buddy Finder

A comprehensive web application designed to connect college students with compatible study partners based on academic interests, shared classes, and learning preferences.


## 🎯 Project Overview

Commons App is an intelligent platform that uses advanced matching algorithms to recommend study partners and provides real-time chat functionality for seamless communication between collge students.

### ✨ Key Features

- 🧠 **Smart Matching**: AI-powered study buddy recommendations
- 💬 **Real-time Chat**: Instant messaging with study partners
- 👥 **Social Features**: Friend requests and connections
- 📱 **Responsive Design**: Works on all devices
- 🔐 **Secure Authentication**: JWT-based user management
- 📊 **Profile Management**: Comprehensive user profiles

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **CORS**: Cross-Origin Resource Sharing

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Custom CSS with modern design
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Commons
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. **Environment Setup**

Create `.env` file in the `Backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/buddy_finder
JWT_KEY=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Create `.env` file in the `Frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```

4. **Start the application**

**Terminal 1 - Backend:**
```bash
cd Backend
npm run debug
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173 
- Backend API: http://localhost:3000

## 📁 Project Structure

```
Study-Buddy-Finder/
├── Backend/
│   ├── src/
│   │   ├── models/          # Database schemas
│   │   │   ├── users.js
│   │   │   ├── friends.js
│   │   │   ├── chat.js
│   │   │   └── authentication.js
│   │   ├── routes/          # API endpoints
│   │   │   └── userRoutes.js
│   │   ├── middleware/      # Authentication
│   │   │   └── auth.js
│   │   ├── utils/           # Matching algorithm
│   │   │   └── matchingEngine.js
│   │   ├── config/          # Database config
│   │   │   └── db.js
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── .env
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Landing.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Friends.jsx
│   │   │   ├── User.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── styles/          # CSS files
│   │   │   ├── Landing.css
│   │   │   ├── Home.css
│   │   │   ├── Friends.css
│   │   │   ├── User.css
│   │   │   └── index.css
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── .env
└── README.md
```

## 🔧 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/save-profile` | User registration |
| POST | `/api/users/login` | User login |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/get-current-user` | Get current user profile |
| PUT | `/api/users/update-profile` | Update user profile |
| GET | `/api/users/get-all-users` | Get all users (with filters) |

### Social Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/get-friends` | Get user's friends |
| GET | `/api/users/get-pending-friends` | Get pending friend requests |
| POST | `/api/users/send-friend-request` | Send friend request |
| POST | `/api/users/connect_friend` | Accept friend request |

### Chat System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/get-chat-history` | Get chat history |
| POST | `/api/users/send-message` | Send message |

### Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/recommend-buddies` | Get study buddy recommendations |

## 🧠 Matching Algorithm

The study buddy recommendation system uses a sophisticated scoring algorithm:

| Criteria | Points | Weight |
|----------|--------|--------|
| Same Department | +3 | High Priority |
| Same Academic Year | +2 | Medium Priority |
| Shared Classes | +2 per class | High Priority |
| Shared Interests | +1 per interest | Medium Priority |
| Mentor Status | +1 | Bonus |
| **Maximum Score** | **8+** | Perfect Match |

## 🎨 UI/UX Features

### Modern Design Elements
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: 0.3s transitions
- **Hover Effects**: Interactive feedback
- **Loading States**: Animated spinners
- **Responsive Layout**: Mobile-first design

### User Experience
- **Intuitive Navigation**: 4 main sections
- **Real-time Updates**: Dynamic content refresh
- **Error Handling**: User-friendly messages
- **Accessibility**: Focus management and contrast

## 📱 Screenshots

### Landing Page
- Clean login/registration interface
- USC-themed design
- Form validation

### Home Page
- Top recommendations display
- Filterable user list
- Interactive "see more" functionality

### Friends Page
- Friends list with chat interface
- Real-time messaging
- Message history

### Profile Page
- Editable user profile
- Save/update functionality
- Form validation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs encryption
- **Input Validation**: express-validator
- **CORS Protection**: Cross-origin security
- **Environment Variables**: Secure configuration


## 🧪 Testing

### Backend Testing
```bash
cd Backend
# Test individual endpoints
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@usc.edu","password":"password"}'
```

### Frontend Testing
```bash
cd Frontend
npm run dev
# Open http://localhost:5173
```

## 📊 Database Schema

### Users Collection
```javascript
{
  firstname: String,
  lastname: String,
  email: String (unique, USC domain),
  password: String (hashed),
  dept: String,
  classes: [String],
  mentor: Boolean,
  current_year: String,
  interests: [String],
  usc_id: String (unique, 10 digits)
}
```

### Friends Collection
```javascript
{
  usc_id: String (references User),
  matching_id: String (references User),
  status: Number (0=pending, 1=accepted)
}
```

### Chat Collection
```javascript
{
  sender_usc_id: String,
  receiver_usc_id: String,
  message: String,
  message_type: String,
  timestamp: Date,
  status: String
}
```

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run debug    # Start with nodemon
npm start         # Production start
```

**Frontend:**
```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint checking
```

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb://localhost:27017/buddy_finder
JWT_KEY=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
```


## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Study group formation
- [ ] Calendar integration
- [ ] Video chat integration
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

*Connecting minds, building futures* 🎓✨