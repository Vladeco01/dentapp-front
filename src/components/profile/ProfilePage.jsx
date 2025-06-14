import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotsByDate, setSlotsByDate] = useState({});

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

  useEffect(() => {
    const grouped = {};
    freeSlots.forEach((s) => {
      const date = s.split("T")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(s);
    });
    setSlotsByDate(grouped);
  }, [freeSlots]);

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

  const handleConfirmBlock = async () => {
    if (!selectedSlot) return;
    await handleBlockSlot(selectedSlot);
    setShowBlockModal(false);
    setSelectedSlot("");
    setSelectedDate(null);
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
          <Button variant="danger" onClick={() => setShowBlockModal(true)}>
            Blochează un interval
          </Button>
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
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Blochează interval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {freeSlots.length === 0 ? (
            <p>Nu există intervale disponibile.</p>
          ) : (
            <>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                prevLabel="‹"
                nextLabel="›"
                prev2Label="«"
                next2Label="»"
                tileClassName={({ date }) => {
                  const d = date.toISOString().slice(0, 10);
                  const classes = [
                    slotsByDate[d]
                      ? styles.availableDay
                      : styles.unavailableDay,
                  ];
                  if (
                    selectedDate &&
                    date.toDateString() === selectedDate.toDateString()
                  ) {
                    classes.push(styles.selectedDay);
                  }
                  return classes.join(" ");
                }}
                tileDisabled={({ date }) => {
                  const d = date.toISOString().slice(0, 10);
                  return !slotsByDate[d];
                }}
              />
              {selectedDate &&
                (slotsByDate[selectedDate.toISOString().slice(0, 10)] || [])
                  .length > 0 && (
                  <Form.Select
                    className="mt-3"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                  >
                    <option value="">Selectează ora</option>
                    {(
                      slotsByDate[selectedDate.toISOString().slice(0, 10)] || []
                    ).map((s) => (
                      <option key={s} value={s}>
                        {new Date(s).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </option>
                    ))}
                  </Form.Select>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Închide
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmBlock}
            disabled={!selectedSlot}
          >
            Blochează
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
