import React, { useEffect, useRef, useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
  } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";

function SignUp() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

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
    setIsSigningUp(true);

    try {
      await doCreateUserWithEmailAndPassword(email, password);
      navigate("/Dashboard");
    } catch {
      setError("Sign up failed. Try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSigningUp(true);

    try {
      await doSignInWithGoogle();
      navigate("/Dashboard");
    } catch {
      setError("Google sign up failed.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-8 sm:px-6">
      <div ref={cardRef} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
            Create a new account
          </h1>

          {error && (
            <p className="mb-4 text-center text-sm text-red-600">{error}</p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full cursor-pointer rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSigningUp ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningUp}
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white py-2 font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
            >
              Sign Up with Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/Login"
              className="text-sm font-medium text-indigo-700 hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
    </div>
  );
}

export default SignUp;
