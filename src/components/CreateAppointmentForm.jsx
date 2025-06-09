import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const CreateAppointmentForm = () => {
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const clientId = parseInt(localStorage.getItem("clientId"));
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post(
        "http://localhost:8080/api/appointments/createAppointment",
        {
          description,
          client_id: clientId,
          dentist_id: dentistId,
          start_time: startTime,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(true);
      setDescription("");
      setStartTime("");
      setDentistId("");
    } catch (err) {
      setError("Eroare la trimiterea programării.");
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <h3>Creare programare</h3>
      {success && <Alert variant="success">Programarea a fost trimisă!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formDescription">
          <Form.Label column sm={2}>
            Descriere
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Ex: Consultatie generală"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formStartTime">
          <Form.Label column sm={2}>
            Data și ora
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formDentistId">
          <Form.Label column sm={2}>
            Dentist ID
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              value={dentistId}
              onChange={(e) => setDentistId(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Trimite programare
        </Button>
      </Form>
    </Container>
  );
};

export default CreateAppointmentForm;
