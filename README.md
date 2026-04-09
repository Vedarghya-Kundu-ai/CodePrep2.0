# CodePrep - AI-Powered Coding Interview Platform

**TESTING MODE NOTE**: This version currently runs without authentication to make testing easier. All the authentication and authorization code (Firebase, user profiles, login/signup) has been commented out and preserved in the codebase, so you can enable it again whenever needed.

Building confidence in coding interviews through AI-powered mock interviews with real-time feedback and code review.

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **AI-Powered Coding Interviews**: Real-time conversational mock coding interviews with an AI interviewer powered by Vapi AI
- **Multi-Language Code Editor**: Write code in Python, JavaScript, TypeScript, Java, C++, or C using Monaco Editor
- **Live Transcription**: See both your responses and the AI's responses in real-time
- **Question History**: Keep track of all the practice questions you've worked through
- **Responsive Design**: Works smoothly on mobile, tablet, and desktop
- **Easy to Test**: Currently running without authentication so you can jump in and start practicing immediately
- **Production Ready**: Both backend and frontend are deployed with proper CORS setup

**Note**: Firebase authentication and user profiles are commented out but available if you want to re-enable them.

---

## Project Structure

```
CodePrep2.0/
├── App/                          # React/Vite Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Dashboard.jsx     # Main question selection page
│   │   │   ├── InterviewSpace.jsx # AI interview interface
│   │   │   ├── Profile.jsx       # User profile editor
│   │   │   ├── History.jsx       # Question history
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── SignUp.jsx        # Registration page
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── ui/               # UI components
│   │   ├── contexts/             # React Context (Auth)
│   │   ├── firebase/             # Firebase config
│   │   ├── lib/                  # Utilities & constants
│   │   ├── css/                  # Tailwind styles
│   │   ├── assets/               # Images & media
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── Backend/                      # FastAPI Server
│   ├── main.py                   # FastAPI app & endpoints
│   ├── models.py                 # SQLAlchemy database models
│   ├── __init__.py
│   └── questions.db              # SQLite database
│
├── requirements.txt              # Python dependencies
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

---

## Testing Mode - Authless Configuration

This version is set up in testing mode without authentication, so you can immediately start using all features without logging in. None of the original authentication code has been deleted—it's all just commented out and easy to re-enable when you're ready.

### What's turned off for testing:

Firebase authentication (Email/Password and Google Sign-in), user registration, login pages, user profile storage, and per-user data isolation. The backend user management endpoints are also commented out.

### How it works right now:

Everyone uses the same mock user account (authless-user-001). All features are immediately accessible without any login. Questions get stored under this shared account, and there's no authentication required for any of the app's routes.

### Files that were modified:

**Backend (main.py)**
- UserDB model and all user endpoints are commented out
- Auth helper functions like hash_password and generate_random_username are commented out
- Question endpoints (POST, GET, DELETE) still work normally

**Frontend Components**
- src/contexts/authContext/index.jsx uses a mock user instead of Firebase
- src/components/Login.jsx has auth disabled and doesn't actually do anything
- src/components/SignUp.jsx just redirects to the Dashboard
- src/components/Dashboard.jsx removes the auth check before starting interviews
- src/components/History.jsx loads questions for the authless user
- src/components/Profile.jsx has profile editing disabled but the page is still accessible
- src/components/Navbar.jsx sign out button just takes you back to the Dashboard

### How to get authentication back:

When you're ready to re-enable authentication:

1. In Backend/main.py: find all the `# AUTHLESS:` comments and uncomment those sections
2. In all React components: find all the `// AUTHLESS:` comments and uncomment those sections
3. In src/contexts/authContext/index.jsx: restore the Firebase imports and auth listeners
4. In models.py: uncomment the UserDB import and make sure the tables get created

All the original code is still there with clear markers so it's easy to find and restore.

---

## Getting Started

### Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git** (for version control)
- **Vapi AI Account** (for AI interviews)
- *Firebase Account* (only needed to re-enable authentication)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CodePrep2.0.git
cd CodePrep2.0
```

#### 2. Setup Backend

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Run the server
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`

#### 3. Setup Frontend

```bash
cd App

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Environment Variables

**Backend** (create `.env` in Backend/ folder):
```
DATABASE_URL=sqlite:///./questions.db
VAPI_KEY=your_vapi_ai_key
```

**Frontend** (update in `src/lib/utils.js`):
```javascript
export const API_BASE_URL = "http://127.0.0.1:8000";  // Local development
// or
export const API_BASE_URL = "https://your-backend-url.com";  // Production
```

**Firebase Config** (update in `src/firebase/firebase.js`):
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 📚 Tech Stack

### Frontend
- **React 19.1.0** - UI framework
- **Vite 7.1.3** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first CSS
- **Monaco Editor** - Advanced code editor
- **Firebase 12.1.0** - Authentication & backend integration
- **Axios 1.11.0** - HTTP client
- **React Router 7.8.1** - Client-side routing
- **GSAP 3.13.0** - Animation library
- **Vapi AI Web** - Voice interview AI

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM (Object Relational Mapping)
- **Pydantic** - Data validation
- **SQLite** - Lightweight database

---

## 🔌 API Endpoints

### Questions Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add_question` | Save a new question |
| GET | `/questions/{user_id}` | Get all questions for a user |
| DELETE | `/questions/{user_id}/{question_id}` | Delete a specific question |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/sync` | Create/update user profile |
| GET | `/users/{user_id}` | Fetch user profile |
| PUT | `/users/{user_id}/profile` | Update profile details |
| POST | `/users/{user_id}/randomize` | Generate random username & avatar |
| DELETE | `/users/{user_id}/full-delete` | Delete account & all data |

---

## 🚀 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Add environment variables
7. Deploy

Backend URL: `https://codeprep2-0-1.onrender.com`

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables (API base URL)
6. Deploy

---

## 🔐 Security

- ✅ Firebase authentication for secure user login
- ✅ Password hashing with PBKDF2-SHA256 (120k iterations)
- ✅ CORS enabled for authorized origins
- ✅ Sensitive data ignored in `.gitignore`
- ✅ Environment variables for API keys
- ✅ SQLite database with indexed queries

---

## 📖 Usage

### Starting an Interview

1. **Dashboard**: Select a DSA topic or search for a question
2. **Interview Space**: 
   - Click **Start Call** to begin
   - Click microphone to toggle mute/unmute
   - Write code in the editor
   - Submit code for AI feedback
   - Click **End Call** when done

### Managing Profile

1. Navigate to **Profile**
2. Update username, bio, social links
3. Click **Random Pic** for auto-generated avatar
4. Save changes

### Viewing History

1. Click **History** in navbar
2. See all practice questions
3. Delete individual questions
4. Track your interview progress

---

## 🛠️ Development

### Build for Production

**Frontend:**
```bash
cd App
npm run build
npm run preview
```

**Backend:**
```bash
# Backend uses same uvicorn command
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Running Tests

Tests can be added using:
- **Frontend**: Vitest or Jest
- **Backend**: pytest

Example:
```bash
pytest Backend/
```

### Linting & Formatting

**Frontend:**
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### "Call object is not available" Error
- Check Vapi AI credentials in `InterviewSpace.jsx`
- Ensure assistant ID is valid in Vapi dashboard
- Verify API key is active

### "Failed to update profile" Error
- Check browser console (F12 → Console tab)
- Ensure backend is running
- Verify user is synced to database

### CORS Issues
- Check backend CORS configuration in `main.py`
- Ensure frontend URL is in `allow_origins`
- Verify production backend URL in `lib/utils.js`

### Database Errors
- Delete `questions.db` and restart backend to reinitialize
- Ensure Backend folder has write permissions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [vedarghya05@outlook.com]

---

## 🙏 Acknowledgments

- **Vapi AI** - Conversational AI for interviews
- **Monaco Editor** - Advanced code editing
- **Firebase** - Authentication & backend services
- **Tailwind CSS** - Utility-first styling
- **React & FastAPI** - Framework foundations

---

**Made with ❤️ by CodePrep Team**

Last Updated: March 18, 2026
