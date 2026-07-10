import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

function Navbar({ darkMode, setDarkMode }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if(confirm("Sign out ?")) {
      try {
        await doSignOut();
        navigate("/");
      } catch {
        alert("Sign out failed. Please try again.");
      }
    } else {
      return ;
    }
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer select-none items-center gap-2"
      >
        <span className="text-2xl font-bold text-indigo-600">{`</>`}</span>
        <span className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
          CodePrep
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-slate-700 dark:text-slate-200 sm:gap-x-6 sm:text-base">
        <li>
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </li>

        {currentUser && (
          <>
            <li>
              <Link
                to="/dashboard"
                className="font-medium text-slate-700 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="font-medium text-slate-700 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
              >
                Past Interviews
              </Link>
            </li>
          </>
        )}

        {currentUser ? (
          <li>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSignOut}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
              >
                Sign Out
              </button>
            </div>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="font-medium text-slate-700 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="font-medium text-slate-700 hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
      </div>
    </nav>
  );
}

export default Navbar;
