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
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-bg relative min-h-screen overflow-hidden pt-24 sm:pt-28">
          <div className="ambient-layer" aria-hidden="true">
            <span className="ambient-orb ambient-orb-one" />
            <span className="ambient-orb ambient-orb-two" />
            <span className="ambient-orb ambient-orb-three" />
          </div>

          <div className="app-content relative z-10">
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
  );
}

export default App
