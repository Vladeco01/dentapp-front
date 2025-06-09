import { Container, Navbar, Nav } from "react-bootstrap";
import appLogo from "../assets/logo.png";
import { Link } from "react-router";

const Header = () => {
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={appLogo}
              alt="DentApp"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <span className="fw-bold">DentApp</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/appointments">
              Appointments
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
