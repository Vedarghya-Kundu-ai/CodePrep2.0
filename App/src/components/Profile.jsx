import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/authContext";

function Profile() {
  const { currentUser, userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">Profile</h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <p className="text-slate-900 dark:text-slate-100">{currentUser?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">User ID</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{currentUser?.uid || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;