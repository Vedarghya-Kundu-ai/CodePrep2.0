import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
// AUTHLESS: Commented out Firebase sign out import
// import { doSignOut } from "../firebase/auth";

function Navbar() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if(confirm("Are you sure you want to sign out?")) {
      try {
        // AUTHLESS: Firebase sign out disabled
        // await doSignOut();
        navigate("/Dashboard");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      return ;
    }
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer select-none items-center gap-2"
      >
        <span className="text-2xl font-bold text-indigo-600">{`</>`}</span>
        <span className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          CodePrep
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-slate-700 sm:gap-x-6 sm:text-base">
        {currentUser && (
          <>
            <li>
              <Link
                to="/Dashboard"
                className="font-medium text-slate-700 hover:text-indigo-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/History"
                className="font-medium text-slate-700 hover:text-indigo-700"
              >
                History
              </Link>
            </li>
          </>
        )}

        {currentUser ? (
          <li>
            <div className="flex items-center gap-3">
              {userProfile?.profile_pic ? (
                <button
                  onClick={() => navigate("/Profile")}
                  type="button"
                  className="cursor-pointer"
                  title={userProfile?.username || "Profile"}
                >
                  <img
                    src={userProfile.profile_pic}
                    alt="profile"
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                </button>
              ) : null}
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
                to="/Login"
                className="font-medium text-slate-700 hover:text-indigo-700"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/SignUp"
                className="font-medium text-slate-700 hover:text-indigo-700"
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
