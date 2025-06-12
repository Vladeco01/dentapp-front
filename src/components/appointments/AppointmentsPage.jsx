import axios from "axios";
import { useEffect, useState } from "react";
import { Container, ListGroup, Button } from "react-bootstrap";
import styles from "./AppointmentsPage.module.css";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const userId = parseInt(localStorage.getItem("clientId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const url =
        role === "DENTIST"
          ? `http://localhost:8080/api/appointments/dentist/${userId}/pending`
          : `http://localhost:8080/api/appointments/client/${userId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setAppointments(response.data);
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

  const handleAccept = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/accept`,
        null,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      getAppointments();
    } catch (error) {
      console.error("Eroare la acceptare:", error);
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/decline`,
        null,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      getAppointments();
    } catch (error) {
      console.error("Eroare la respingere:", error);
    }
  };

  return (
    <Container className={styles.appointmentsContainer}>
      <h2 className="mb-4">
        {role === "DENTIST" ? "Programări în așteptare" : "Programările mele"}
      </h2>
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
              {role === "DENTIST" ? (
                <span>
                  <strong>Client:</strong> {appt.clientName}
                </span>
              ) : (
                <span>
                  <strong>Dentist:</strong> {appt.dentistName}
                </span>
              )}
              <span>
                <strong> Status: </strong> {appt.status}
              </span>
            </div>
            {role === "DENTIST" ? (
              <div className={styles.actionButtons}>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleAccept(appt.id)}
                >
                  Acceptă
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDecline(appt.id)}
                >
                  Respinge
                </Button>
              </div>
            ) : (
              ["ACCEPTED", "WAITING"].includes(appt.status) && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className={styles.cancelButton}
                  onClick={() => handleCancel(appt.id)}
                >
                  Anulează
                </Button>
              )
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AppointmentsPage;