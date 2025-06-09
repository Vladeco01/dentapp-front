import { useState } from "react";
import authService from "../service/AuthService";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <Card.Title className="text-center mb-3">
                {isLogin ? "Login" : "Register"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <Form.Group className="mb-2" controlId="firstName">
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="lastName">
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group className="mb-2" controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  {isLogin ? "Login" : "Register"}
                </Button>
              </Form>
              <div className="text-center mt-3">
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
