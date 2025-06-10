import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authentication/AuthContext";
import PropTypes from "prop-types";

export default function PublicRoute({ redirectTo = "/appointments" }) {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

PublicRoute.propTypes = {
  redirectTo: PropTypes.string,
};
