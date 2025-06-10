import { useState } from "react";
import AuthService from "../../service/AuthService";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const authService = AuthService;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const data = await authService.login(formData);
        console.log("Login success:", data);
        const role = data.role;
        if (role === "ADMIN") {
          window.location.href = "/admin";
        } else if (role === "DENTIST") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/clinics";
        }
      } else {
        const data = await authService.register(formData);
        console.log("Register success:", data);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth error:", error.response?.data || error.message);
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                {isLogin ? "Login" : "Register"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Form.Group controlId="firstName" className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3">
                  {isLogin ? "Login" : "Register"}
                </Button>
              </Form>

              <div className="text-center">
                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin
                    ? "Don't have an account? Register"
                    : "Already have an account? Login"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthenticationPage;
