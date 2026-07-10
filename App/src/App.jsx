import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Login from "./components/Login";
import InterviewSpace from "./components/InterviewSpace";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import History from "./components/History";
import Profile from "./components/Profile";
import Landing from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ darkMode, setDarkMode }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className={darkMode ? "dark" : ""}>
      <AuthProvider>
        {!isLanding && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
        <div className={`relative min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 ${isLanding ? "" : "pt-24 sm:pt-28"}`}>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={< Landing darkMode={darkMode} setDarkMode={setDarkMode} />} />
              <Route path="/login" element={< Login/>} />
              <Route path="/signup" element={< SignUp/>} />
              <Route path="/dashboard" element={< ProtectedRoute>< Dashboard/></ProtectedRoute>} />
              <Route path="/interview/:id" element={< ProtectedRoute>< InterviewSpace/></ProtectedRoute>} />
              <Route path="/history" element={< ProtectedRoute>< History/></ProtectedRoute>} />
              <Route path="/profile" element={< ProtectedRoute>< Profile/></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />
    </Router>
  );
}

export default App
