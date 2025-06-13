import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../authentication/AuthContext";
import PropTypes from "prop-types";

export default function AdminRoute({ redirectTo = "/authenticate" }) {
  const { isAuthenticated } = useContext(AuthContext);
  const role = localStorage.getItem("role");
  return isAuthenticated && role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace />
  );
}

AdminRoute.propTypes = {
  redirectTo: PropTypes.string,
};
