import { useContext, useEffect, useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import appLogo from "../assets/logo.png";
import { AuthContext } from "../components/authentication/AuthContext";
import styles from "./Header.module.css";
import NotificationService from "../service/NotificationService";
import PropTypes from "prop-types";

const Header = ({ minimal = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, firstName, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const userId = parseInt(localStorage.getItem("clientId"));
  const role = localStorage.getItem("role");
  const full = isAuthenticated && !minimal;

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getForUser(userId);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/authenticate", { replace: true });
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  const handleNotificationsToggle = async (isOpen) => {
    if (!isOpen) {
      try {
        await Promise.all(
          unreadNotifications.map((n) => NotificationService.markAsRead(n.id))
        );
        if (unreadNotifications.length > 0) {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={appLogo} alt="DentApp" className={styles.logo} />
          <span className="fw-bold">DentApp</span>
        </Navbar.Brand>
        {full && (
          <>
            <Navbar.Toggle aria-controls="main-navbar-nav" />
            <Navbar.Collapse id="main-navbar-nav">
              <Nav className="me-auto">
                {role === "ADMIN" ? (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                ) : (
                  <>
                    {role !== "DENTIST" && (
                      <Nav.Link as={Link} to="/clinics">
                        Clinici
                      </Nav.Link>
                    )}
                    <Nav.Link as={Link} to="/appointments">
                      Programări
                    </Nav.Link>
                  </>
                )}
              </Nav>

              <Nav className="ms-auto align-items-center">
                {role === "CLIENT" && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate("/favorites")}
                  >
                    ❤
                  </Button>
                )}
                {role !== "ADMIN" && (
                  <NavDropdown
                    title={
                      <span className={styles.notificationToggle}>
                        Notifications
                        {unreadCount > 0 && (
                          <Badge bg="danger" pill className="ms-1">
                            {unreadCount}
                          </Badge>
                        )}
                      </span>
                    }
                    id="notifications-nav-dropdown"
                    align="end"
                    onToggle={handleNotificationsToggle}
                    className={styles.notificationDropdown}
                  >
                    {unreadNotifications.length === 0 ? (
                      <NavDropdown.ItemText>
                        No notifications
                      </NavDropdown.ItemText>
                    ) : (
                      unreadNotifications.map((n) => (
                        <NavDropdown.ItemText key={n.id}>
                          {n.message}
                        </NavDropdown.ItemText>
                      ))
                    )}
                  </NavDropdown>
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
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;

Header.propTypes = {
  minimal: PropTypes.bool,
};
