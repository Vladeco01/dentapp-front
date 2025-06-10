import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <Row>
        <Col className="text-center">
          <h1 className="display-1">404</h1>
          <p className="lead">
            Sorry, the page you are looking for does not exist.
          </p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
