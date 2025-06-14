import axios from "axios";
import { useEffect, useState } from "react";
import { Container, ListGroup, Button, Form } from "react-bootstrap";
import styles from "./AppointmentsPage.module.css";
import { toast } from "react-toastify";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const userId = parseInt(localStorage.getItem("clientId"));
  const role = localStorage.getItem("role");

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    try {
      const url =
        role === "DENTIST"
          ? `http://localhost:8080/api/appointments/dentist/${userId}`
          : `http://localhost:8080/api/appointments/client/${userId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      let data = response.data;
      console.log(data);
      if (role === "DENTIST") {
        data = await Promise.all(
          data.map(async (appt) => {
            if (!appt.clientName && appt.clientId) {
              try {
                const res = await axios.get(
                  `http://localhost:8080/users/getUser/${appt.clientId}`,
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                );
                return {
                  ...appt,
                  clientName: `${res.data.firstName} ${res.data.lastName}`,
                };
              } catch (e) {
                console.error(e);
                return appt;
              }
            }
            return appt;
          })
        );
        data = data.filter((appt) => appt.status !== "BLOCKED");
      }

      setAppointments(data);
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
      toast.success("Programare anulata");
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
      toast.success("Programare acceptata");
    } catch (error) {
      console.error("Eroare la acceptare:", error);
    }
  };

  const handleDecline = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/${appointmentId}/deny`,
        null,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      getAppointments();
      toast.success("Programare respinsa");
    } catch (error) {
      console.error("Eroare la respingere:", error);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesName = nameFilter
      ? [appt.dentistName, appt.clientName]
          .filter(Boolean)
          .some((n) => n.toLowerCase().includes(nameFilter.toLowerCase()))
      : true;
    const matchesDate = dateFilter
      ? appt.startTime.slice(0, 10) === dateFilter
      : true;
    const matchesStatus = statusFilter ? appt.status === statusFilter : true;

    return matchesName && matchesDate && matchesStatus;
  });

  return (
    <Container className={styles.appointmentsContainer}>
      <h2 className="mb-4">Programările mele</h2>
      <Form.Control
        className="mb-3"
        placeholder="Caută după nume"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <Form.Control
        className="mb-3"
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      <Form.Select
        className="mb-3"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Toate statusurile</option>
        {Array.from(new Set(appointments.map((a) => a.status))).map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </Form.Select>
      <ListGroup as="ul">
        {filteredAppointments.map((appt) => (
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
            {role === "DENTIST"
              ? appt.status === "WAITING" && (
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
                )
              : ["ACCEPTED", "WAITING"].includes(appt.status) && (
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
