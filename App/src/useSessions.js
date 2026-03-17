import { useState, useEffect } from "react";

export default function useSession() {
  const [session, setSession] = useState(null);

  // Load session on first render
  useEffect(() => {
    const saved = localStorage.getItem("currentSession");
    if (saved) {
      setSession(JSON.parse(saved));
    }
  }, []);

  function startSession(question) {
    const newSession = { question, startedAt: Date.now() };
    setSession(newSession);
    localStorage.setItem("currentSession", JSON.stringify(newSession));
  }

  function endSession() {
    setSession(null);
    localStorage.removeItem("currentSession");
  }

  return { session, startSession, endSession };
}
