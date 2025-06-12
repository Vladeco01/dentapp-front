import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notifications";

const getForUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}?userId=${userId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};

const markAsRead = async (notificationId) => {
  await axios.post(`${API_BASE_URL}/${notificationId}/read`, null, {
    headers: { Authorization: localStorage.getItem("token") },
  });
};

export default { getForUser, markAsRead };
