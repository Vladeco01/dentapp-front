import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/clinics";

const getClinicForDentist = async (dentistId) => {
  const response = await axios.get(`${API_BASE_URL}/get-clinic/${dentistId}`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  return response.data;
};

const createClinic = async (dentistId, clinic) => {
  const response = await axios.post(
    `${API_BASE_URL}/create-clinic/${dentistId}`,
    clinic,
    {
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const addDentistToClinic = async (clinicId, dentistId) => {
  const response = await axios.post(
    `${API_BASE_URL}/${clinicId}/add-dentist/${dentistId}`,
    null,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );
  return response.data;
};

const getClinicIdForDentist = async (dentistId) => {
  const response = await axios.get(
    `${API_BASE_URL}/get-clinic-id/${dentistId}`,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );
  return response.data;
};

export default {
  getClinicForDentist,
  createClinic,
  addDentistToClinic,
  getClinicIdForDentist,
};
