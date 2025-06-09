import axios from "axios";
import { useEffect, useState } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import styles from "./AppointmentsPage.module.css";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const clientId = parseInt(localStorage.getItem("clientId"));

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/appointments/client/${clientId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setAppointments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      getAppointments();
    } catch (error) {
      console.error("Eroare la anulare:", error);
    }
  };

  return (
    <Container className={styles.appointmentsContainer}>
      <h2 className="mb-4">Programările mele</h2>
      <ListGroup as="ul">
        {appointments.map((appt) => (
          <ListGroup.Item
            as="li"
            key={appt.id}
            className={styles.appointmentItem}
          >
            <div className={styles.appointmentDetails}>
              <span>
                <strong>Start: </strong>{" "}
                {new Date(appt.startTime).toLocaleString()}
              </span>
              <span>
                <strong> End: </strong>{" "}
                {new Date(appt.endTime).toLocaleString()}
              </span>
              <span>
                <strong>Descriere:</strong> {appt.description}
              </span>
              <span>
                <strong>Dentist:</strong> {appt.dentistName}
              </span>
              <span>
                <strong> Status: </strong> {appt.status}
              </span>
            </div>
            {["ACCEPTED", "WAITING"].includes(appt.status) && (
              <Button
                variant="outline-danger"
                size="sm"
                className={styles.cancelButton}
                onClick={() => handleCancel(appt.id)}
              >
                Anulează
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AppointmentsPage;
