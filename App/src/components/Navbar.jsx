import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

function Navbar() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if(confirm("Are you sure you want to sign out?")) {
      try {
        await doSignOut();
        navigate("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      return ;
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/15 bg-slate-950/60 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4">
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer select-none items-center gap-2"
      >
        <span className="text-2xl font-bold text-rose-300">{`</>`}</span>
        <span className="logo-glow retro-title bg-gradient-to-r from-rose-100 via-pink-300 to-fuchsia-300 bg-clip-text text-4xl text-transparent sm:text-5xl">
          CodePrep
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-slate-200 sm:gap-x-6 sm:text-base">
        {currentUser && (
          <>
            <li>
              <Link
                to="/Dashboard"
                className="amber-link"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/History"
                className="amber-link"
              >
                History
              </Link>
            </li>
            <li>
              <Link
                to="/Profile"
                className="amber-link"
              >
                Profile
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
                    className="h-9 w-9 rounded-full border border-white/20 object-cover"
                  />
                </button>
              ) : null}
              <button
                onClick={handleSignOut}
                className="warm-button cursor-pointer rounded-lg px-4 py-2 font-semibold"
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
                className="amber-link"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/SignUp"
                className="amber-link"
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
