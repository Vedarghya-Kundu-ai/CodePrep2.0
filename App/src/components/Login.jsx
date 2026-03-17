import React, { useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, Link } from "react-router-dom";

function Login() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch {
        setError("Invalid credentials, please try again.");
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (error) {
        console.error("Google sign-in error:", error);
        const code = error?.code || "";
        if (code === "auth/popup-closed-by-user") {
          setError("Google sign-in popup was closed before completing.");
        } else if (code === "auth/popup-blocked") {
          setError("Popup blocked by browser. Please allow popups and retry.");
        } else if (code === "auth/unauthorized-domain") {
          setError("Current domain is not authorized in Firebase settings.");
        } else {
          setError("Google sign-in failed.");
        }
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="page-shell flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-8 sm:px-6">
      {userLoggedIn ? <Navigate to="/Dashboard" /> : null}

      <div className="glass-card glow-hover w-full max-w-md rounded-2xl p-6 shadow-xl sm:p-8">
        <h1 className="retro-title mb-6 text-center text-4xl text-rose-100 sm:text-5xl">
          Login to your account
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
            disabled={isSigningIn}
            className="warm-button w-full cursor-pointer rounded-lg border border-rose-100/25 py-2 font-semibold disabled:opacity-50"
          >
            {isSigningIn ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={onGoogleSignIn}
            className="w-full cursor-pointer rounded-lg border border-white/20 bg-slate-900/70 py-2 font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-rose-300/40 hover:bg-slate-900"
          >
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/SignUp"
            className="amber-link text-sm hover:underline"
          >
            create a new account?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
