import { createContext, useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import PropTypes from "prop-types";
import { getFirstNameFromJwt } from "../../service/JwtService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthService.isLoggedIn()
  );

  const [firstName, setFirstName] = useState(null);
  const authService = AuthService;

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
      setFirstName(getFirstNameFromJwt(token));
    }
  }, []);

  const login = (creds) =>
    authService.login(creds).then((data) => {
      setIsAuthenticated(true);
      const token = authService.getToken();
      setFirstName(getFirstNameFromJwt(token));
      return data;
    });

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, firstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
