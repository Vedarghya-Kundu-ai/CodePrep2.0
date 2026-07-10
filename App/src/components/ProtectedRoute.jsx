import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

function ProtectedRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();

  if (loading) return null;
  if (!userLoggedIn) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
