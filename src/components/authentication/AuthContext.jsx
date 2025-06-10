import { createContext, useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authService = AuthService;

  useEffect(() => {
    setIsAuthenticated(authService.isLoggedIn());
  }, []);

  const login = (creds) =>
    authService.login(creds).then((data) => {
      setIsAuthenticated(true);
      return data;
    });

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
