import axios from "axios";

const API_BASE_URL = "http://localhost:8080/users";
const ROLE_CHANGE_URL = "http://localhost:8080/api/role-change-requests";

const getProfile = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/getUser/${userId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};

const updateProfile = async (userId, data) => {
  const response = await axios.put(
    `${API_BASE_URL}/update-user/${userId}`,
    data,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const requestDentistRole = async (userId) => {
  const response = await axios.post(`${ROLE_CHANGE_URL}/${userId}`, userId, {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const getAllDentists = async () => {
  const response = await axios.get(`${API_BASE_URL}/dentists`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  requestDentistRole,
  getAllDentists,
};
