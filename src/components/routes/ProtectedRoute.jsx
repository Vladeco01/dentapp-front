import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authentication/AuthContext";
import PropTypes from "prop-types";

export default function ProtectedRoute({ redirectTo = "/authenticate" }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

ProtectedRoute.propTypes = {
  redirectTo: PropTypes.string,
};
