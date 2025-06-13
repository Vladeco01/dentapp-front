import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import UserService from "../../service/UserService";
import axios from "axios";
import styles from "./ProfilePage.module.css";
import ClinicService from "../../service/ClinicService";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [clinic, setClinic] = useState(null);
  const [clinicForm, setClinicForm] = useState({ name: "", address: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [dentists, setDentists] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [freeSlots, setFreeSlots] = useState([]);

  const userId = parseInt(localStorage.getItem("clientId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getProfile(userId);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const data = await ClinicService.getClinicForDentist(userId);
        setClinic(data);
      } catch (err) {
        setClinic(null);
        console.log(err);
      }
    };
    if (role === "DENTIST") fetchClinic();
  }, [role, userId]);

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/appointments/free/${userId}`,
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        setFreeSlots(res.data);
      } catch (err) {
        console.error(err);
        setFreeSlots([]);
      }
    };
    if (role === "DENTIST") fetchFreeSlots();
  }, [role, userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateProfile(userId, formData);
      setMessage("Profile updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestRole = async () => {
    try {
      await UserService.requestDentistRole(userId);
      setMessage("Request sent");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClinicFormChange = (e) => {
    setClinicForm({ ...clinicForm, [e.target.name]: e.target.value });
  };

  const handleCreateClinic = async () => {
    try {
      const data = await ClinicService.createClinic(userId, clinicForm);
      setClinic(data);
      setClinicForm({ name: "", address: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDentist = async () => {
    try {
      const idData = await ClinicService.getClinicIdForDentist(userId);
      await ClinicService.addDentistToClinic(idData, selectedDentistId);
      setShowAddModal(false);
      setSelectedDentistId("");
      setSearch("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockSlot = async (slot) => {
    try {
      await axios.post(
        "http://localhost:8080/api/appointments/block",
        { dentistId: userId, startTime: slot },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      setFreeSlots(freeSlots.filter((s) => s !== slot));
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = async () => {
    try {
      const data = await UserService.getAllDentists();
      setDentists(data);
      setShowAddModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className={styles.profileContainer}>
      <h2 className="mb-4">Profile</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="me-2">
          Save
        </Button>
        {role === "CLIENT" && (
          <Button variant="secondary" type="button" onClick={handleRequestRole}>
            Become Dentist
          </Button>
        )}
      </Form>
      {role === "DENTIST" &&
        (!clinic ? (
          <div className="mt-4">
            <h4>Create Clinic</h4>
            <Form.Group className="mb-3" controlId="clinicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={clinicForm.name}
                onChange={handleClinicFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="clinicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={clinicForm.address}
                onChange={handleClinicFormChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleCreateClinic}>
              Create Clinic
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <h4>{clinic.name}</h4>
            <Button variant="secondary" onClick={openAddModal}>
              Add Dentist
            </Button>
          </div>
        ))}
      {role === "DENTIST" && freeSlots.length > 0 && (
        <div className="mt-4">
          <h4>Ore disponibile</h4>
          <ul className={styles.slotList}>
            {freeSlots.map((s) => (
              <li key={s}>
                {new Date(s).toLocaleString()}
                <Button
                  variant="danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleBlockSlot(s)}
                >
                  Blochează
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Dentist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Search by email"
            className="mb-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Form.Select
            value={selectedDentistId}
            onChange={(e) => setSelectedDentistId(e.target.value)}
          >
            <option value="">Select dentist</option>
            {dentists
              .filter((d) =>
                d.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.email}
                </option>
              ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddDentist}
            disabled={!selectedDentistId}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
