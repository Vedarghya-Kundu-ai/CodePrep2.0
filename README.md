# CodePrep 2.0 - AI-Powered Coding Interview Platform

Building confidence in coding interviews through AI-powered mock interviews with real-time feedback and code review.

![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Features

- **AI-Powered Coding Interviews**: Real-time conversational mock coding interviews with AI interviewer powered by Vapi AI
- **Multi-Language Code Editor**: Write code in Python, JavaScript, TypeScript, Java, C++, C with Monaco Editor
- **Live Transcription**: See both your and the AI's responses in real-time
- **User Authentication**: Secure Firebase authentication (Email/Password & Google Sign-in)
- **User Profiles**: Customizable profiles with username, bio, social links (LinkedIn, GitHub, X)
- **Question History**: Track all your practice questions and maintain interview history
- **Responsive Design**: Fully responsive UI optimized for mobile, tablet, and desktop
- **Production Ready**: Deployed backend and frontend with proper CORS configuration

---

## 🏗️ Project Structure

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

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git** (for version control)
- **Firebase Account** (for authentication)
- **Vapi AI Account** (for AI interviews)

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
- Contact: [your-email@example.com]

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
