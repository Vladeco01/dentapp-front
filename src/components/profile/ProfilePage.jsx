import { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import UserService from "../../service/UserService";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [message, setMessage] = useState("");

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

  return (
    <Container style={{ maxWidth: 500 }}>
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
    </Container>
  );
};

export default ProfilePage;
