import { useEffect, useState } from "react";
import axios from "axios";
import { Container, ListGroup, Modal, Button, Form } from "react-bootstrap";
import styles from "./ClinicsPage.module.css";
import FavoriteService from "../../service/FavoriteService";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  const [dentistsByClinic, setDentistsByClinic] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [description, setDescription] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const clientId = parseInt(localStorage.getItem("clientId"));

  useEffect(() => {
    getClinics();
  }, []);

  const getClinics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/clinics/get-clinics`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setClinics(response.data);
      console.log(response.data);
      response.data.forEach((c) => fetchDentists(c.id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDentists = async (clinicId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/clinics/${clinicId}/get-dentists`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setDentistsByClinic((prev) => ({ ...prev, [clinicId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDentistSlots = async (dentistId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/appointments/free/${dentistId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setSlots([]);
    }
  };

  const handleDentistClick = async (dent) => {
    setSelectedDentist(dent);
    setSelectedSlot("");
    setDescription("");
    setShowModal(true);
    await fetchDentistSlots(dent.id);
  };

  const handleToggleFavorite = async (e, dentistId) => {
    e.stopPropagation();
    try {
      if (favoriteIds.includes(dentistId)) {
        await FavoriteService.removeFavorite(clientId, dentistId);
        setFavoriteIds(favoriteIds.filter((id) => id !== dentistId));
      } else {
        await FavoriteService.addFavorite(clientId, dentistId);
        setFavoriteIds([...favoriteIds, dentistId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAppointment = async () => {
    if (!selectedDentist || !selectedSlot || !description) return;

    const clientId = parseInt(localStorage.getItem("clientId"));
    const [datePart, timePart] = selectedSlot.split("T"); // ["2025-06-16", "13:00"]
    const [hourStr, minuteStr] = timePart.split(":"); // ["13","00"]
    const hour = Number(hourStr);

    const startTime = `${datePart}T${hourStr.padStart(2, "0")}:${minuteStr}:00`;

    const nextHour = String(hour + 1).padStart(2, "0");
    const endTime = `${datePart}T${nextHour}:${minuteStr}:00`;

    try {
      await axios.post(
        "http://localhost:8080/api/appointments/createAppointment",
        {
          description,
          clientId,
          dentistId: selectedDentist.id,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className={styles.clinicContainer}>
      <h2 className="mb-4">Clinici</h2>
      <ListGroup as="ul">
        {clinics.map((cns) => (
          <ListGroup.Item as="li" key={cns.id} className={styles.clinicItem}>
            <div className={styles.clinicDetails}>
              <span>
                <strong>Nume: </strong> {cns.name}
              </span>
              <span>
                <strong> Strada: </strong> {cns.address}
              </span>
            </div>
            {dentistsByClinic[cns.id] && (
              <div className={styles.dentistList}>
                {dentistsByClinic[cns.id].map((dent) => (
                  <div key={dent.id} className={styles.dentistCard}>
                    <span onClick={() => handleDentistClick(dent)}>
                      {dent.firstName} {dent.lastName}
                    </span>
                    <span
                      className={styles.favoriteIcon}
                      onClick={(e) => handleToggleFavorite(e, dent.id)}
                    >
                      {favoriteIds.includes(dent.id) ? "♥" : "♡"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDentist &&
              `${selectedDentist.firstName} ${selectedDentist.lastName}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {slots.length === 0 ? (
            <p>Nu există intervale disponibile.</p>
          ) : (
            <Form.Select
              className="mb-3"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              <option value="">Selectează ora</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {new Date(s).toLocaleString()}
                </option>
              ))}
            </Form.Select>
          )}
          <Form.Select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
            <option value="">Tip programare</option>
            <option value="Consultație de rutină">Consultație de rutină</option>
            <option value="Albire dentară">Albire dentară</option>
            <option value="Tratare carie">Tratare carie</option>
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Închide
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateAppointment}
            disabled={!selectedSlot || !description}
          >
            Programează
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
export default ClinicsPage;
