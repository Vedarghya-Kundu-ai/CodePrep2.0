import React, { useEffect, useRef, useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import axios from "axios";
import { API_BASE_URL } from "../lib/utils";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Added: GSAP reveal to keep signup motion aligned with dashboard/auth pages.
  useEffect(() => {
    if (!cardRef.current) {
      return;
    }
    gsap.fromTo(cardRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power3.out" });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await doCreateUserWithEmailAndPassword(email, password);
      // Updated: account creation should proceed even if sync fails once.
      try {
        await axios.post(`${API_BASE_URL}/users/sync`, {
          user_id: result.user.uid,
          email: result.user.email || email,
          password,
          auth_provider: "password",
        });
      } catch (syncError) {
        console.error("Profile sync failed after sign-up:", syncError);
      }
      setIsSignedUp(true);
      navigate("/Login");
    } catch {
      setError("Sign up failed. Try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await doSignInWithGoogle();
      // Updated: allow Google account creation even if backend sync has transient issue.
      try {
        await axios.post(`${API_BASE_URL}/users/sync`, {
          user_id: result.user.uid,
          email: result.user.email || "",
          auth_provider: "google",
        });
      } catch (syncError) {
        console.error("Profile sync failed after Google sign-up:", syncError);
      }
      setIsSignedUp(true);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Google sign-up error:", error);
      const code = error?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed before completing.");
      } else if (code === "auth/popup-blocked") {
        setError("Popup blocked by browser. Please allow popups and retry.");
      } else if (code === "auth/unauthorized-domain") {
        setError("Current domain is not authorized in Firebase settings.");
      } else {
        setError("Google sign up failed.");
      }
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-8 sm:px-6">
      {isSignedUp ? null : (
        <div ref={cardRef} className="glass-card glow-hover w-full max-w-md rounded-2xl p-6 shadow-xl sm:p-8">
          <h1 className="retro-title mb-6 text-center text-4xl text-rose-100 sm:text-5xl">
            Create a new account
          </h1>

          {error && (
            <p className="mb-4 text-center text-sm text-red-300">{error}</p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-400 transition focus:border-rose-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-white/15 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-400 transition focus:border-rose-300 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="warm-button w-full cursor-pointer rounded-lg border border-rose-100/25 py-2 font-semibold"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full cursor-pointer rounded-lg border border-white/20 bg-slate-900/70 py-2 font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-rose-300/40 hover:bg-slate-900"
            >
              Sign Up with Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/Login"
              className="amber-link text-sm hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
