import { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import appLogo from "../assets/logo.png";
import { AuthContext } from "../components/authentication/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, firstName, logout } = useContext(AuthContext);
  const role = localStorage.getItem("role");

  const handleSignOut = () => {
    logout();
    navigate("/authenticate", { replace: true });
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={appLogo} alt="DentApp" className={styles.logo} />
          <span className="fw-bold">DentApp</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {role !== "DENTIST" && (
              <Nav.Link as={Link} to="/clinics">
                Clinici
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/appointments">
              Programări
            </Nav.Link>
          </Nav>

          {isAuthenticated && (
            <Nav className="ms-auto align-items-center">
              {role !== "DENTIST" && (
                <Button
                  variant="outline-light"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate("/favorites")}
                >
                  ❤
                </Button>
              )}
              <NavDropdown
                title={`Hello, ${firstName || "User"}`}
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={goToProfile}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSignOut}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
