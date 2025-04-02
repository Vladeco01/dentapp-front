import appLogo from "../assets/logo.png";
import ButtonNavbar from "./ButtonNavbar";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={appLogo}
            alt="DentApp"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <span className="fw-bold">DentApp</span>
        </a>
        <div className="d-flex">
          <ButtonNavbar title="Appointments" to="/appointments" />
          <ButtonNavbar title="Clinics" to="/clinics" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
