import React, { useState } from "react";
// AUTHLESS: Commented out Firebase auth imports
// import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, Link } from "react-router-dom";

function Login() {
  // AUTHLESS: User is always logged in
  const { userLoggedIn } = useAuth();

  // AUTHLESS: Commented out form state
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [isSigningIn, setIsSigningIn] = useState(false);
  // const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    // AUTHLESS: Auth skipped
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    // AUTHLESS: Auth skipped
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-4 py-8 sm:px-6">
      {userLoggedIn ? <Navigate to="/Dashboard" /> : null}

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Login to your account
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
            disabled={isSigningIn}
            className="w-full cursor-pointer rounded-lg bg-indigo-600 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSigningIn ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={onGoogleSignIn}
            className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white py-2 font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            Continue with Google
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/SignUp"
            className="text-sm font-medium text-indigo-700 hover:underline"
          >
            create a new account?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
