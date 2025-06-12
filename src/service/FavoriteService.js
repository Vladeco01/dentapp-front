import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/favorites";

const getFavorites = async (clientId) => {
  const response = await axios.get(`${API_BASE_URL}/${clientId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  console.log(response.data);
  return response.data;
};

const addFavorite = async (clientId, dentistId) => {
  const response = await axios.post(
    `${API_BASE_URL}/${clientId}/${dentistId}`,
    null,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );
  return response.data;
};

const removeFavorite = async (clientId, dentistId) => {
  await axios.delete(`${API_BASE_URL}/${clientId}/${dentistId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
};

export default { getFavorites, addFavorite, removeFavorite };