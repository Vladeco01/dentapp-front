import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/clinics";

const getClinicForDentist = async (dentistId) => {
  const response = await axios.get(`${API_BASE_URL}/get-clinic/${dentistId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};

export default { getClinicForDentist };