import { useEffect, useState } from "react";
import { Container, ListGroup, Button, Modal, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import FavoriteService from "../../service/FavoriteService";
import styles from "./FavoritePage.module.css";
import ClinicService from "../../service/ClinicService";
import { toast } from "react-toastify";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const clientId = parseInt(localStorage.getItem("clientId"));
  const [clinicMap, setClinicMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [slotsByDate, setSlotsByDate] = useState({});

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await FavoriteService.getFavorites(clientId);
      setFavorites(data);
      data.forEach((fav) => fetchClinic(fav.id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClinic = async (dentistId) => {
    try {
      const info = await ClinicService.getClinicForDentist(dentistId);
      setClinicMap((prev) => ({ ...prev, [dentistId]: info }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDentistSlots = async (dentistId) => {
    try {
      const [slotsRes, apptRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/appointments/free/${dentistId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        }),
        axios.get(
          `http://localhost:8080/api/appointments/dentist/${dentistId}`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        ),
      ]);
      const taken = new Set(
        apptRes.data
          .filter((a) => ["ACCEPTED", "WAITING"].includes(a.status))
          .map((a) => a.startTime.slice(0, 16))
      );
      setSlots(slotsRes.data.filter((s) => !taken.has(s)));
    } catch (err) {
      console.error(err);
      setSlots([]);
    }
  };

  useEffect(() => {
    const grouped = {};
    slots.forEach((s) => {
      const date = s.split("T")[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(s);
    });
    setSlotsByDate(grouped);
  }, [slots]);

  const handleOpenModal = async (dentist) => {
    setSelectedDentist(dentist);
    setSelectedSlot("");
    setDescription("");
    setSelectedDate(null);
    setShowModal(true);
    await fetchDentistSlots(dentist.id);
  };

  const handleCreateAppointment = async () => {
    if (!selectedDentist || !selectedSlot || !description) return;

    const clientId = parseInt(localStorage.getItem("clientId"));
    const [datePart, timePart] = selectedSlot.split("T");
    const [hourStr, minuteStr] = timePart.split(":");
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
      toast.success("Cerere de programare creata");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className={styles.favoritesContainer}>
      <h2 className="mb-4">Favorite</h2>
      <ListGroup as="ul">
        {favorites.map((fav) => (
          <ListGroup.Item as="li" key={fav.id} className={styles.favoriteItem}>
            <h4>
              {fav.firstName} {fav.lastName}
            </h4>
            <span>Email: {fav.email}</span>
            <br></br>
            <span>{clinicMap[fav.id] && clinicMap[fav.id]}</span>
            <div className="mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenModal(fav)}
              >
                Programează
              </Button>
            </div>
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
            <>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => {
                  const d = date.toISOString().slice(0, 10);
                  return slotsByDate[d]
                    ? styles.availableDay
                    : styles.unavailableDay;
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
          <Form.Select
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
            <option value="" disabled hidden>
              Tip programare
            </option>
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

export default FavoritePage;
