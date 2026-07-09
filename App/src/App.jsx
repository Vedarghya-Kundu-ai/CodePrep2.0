import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Login from "./components/Login";
import InterviewSpace from "./components/InterviewSpace";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import History from "./components/History";
import Profile from "./components/Profile";

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <AuthProvider>
        <Router>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="relative min-h-screen bg-slate-50 pt-24 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:pt-28">

            <div className="relative z-10">
              <Routes>
                <Route path="/" element={< Dashboard/>} />
                <Route path="/SignUp" element={< SignUp/>} />
                <Route path="/Login" element={< Login/>} />
                <Route path="/Dashboard" element={< Dashboard/>} />
                <Route path="/interviewSpace" element={< InterviewSpace/>} />
                <Route path="/History" element={< History/>} />
                <Route path="/Profile" element={< Profile/>} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App
