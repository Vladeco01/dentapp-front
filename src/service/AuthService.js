import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const register = async ({ firstName, lastName, email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    firstName,
    lastName,
    email,
    password,
  });
  return response.data;
};

const login = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  const { token, role, clientId } = response.data;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("clientId", clientId);

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

const isLoggedIn = () => Boolean(localStorage.getItem("token"));

const getCurrentUserRole = () => {
  return localStorage.getItem("role");
};

const getToken = () => {
  return localStorage.getItem("token");
};

export default {
  register,
  login,
  logout,
  getCurrentUserRole,
  getToken,
  isLoggedIn,
};
