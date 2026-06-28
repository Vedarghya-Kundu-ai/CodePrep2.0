import React, { useEffect, useRef, useState } from "react";
// AUTHLESS: Commented out Firebase auth imports
// import {
//   doCreateUserWithEmailAndPassword,
//   doSignInWithGoogle,
// } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import axios from "axios";
import { API_BASE_URL } from "../lib/utils";

function SignUp() {
  // AUTHLESS: Simplified signup form
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
    // AUTHLESS: Skip auth and go directly to dashboard
    navigate("/Dashboard");
  };

  const handleGoogleSignIn = async () => {
    // AUTHLESS: Skip auth and go directly to dashboard
    navigate("/Dashboard");
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-8 sm:px-6">
      <div ref={cardRef} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Create a new account
          </h1>

          {error && (
            <p className="mb-4 text-center text-sm text-red-600">{error}</p>
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white py-2 font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
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
