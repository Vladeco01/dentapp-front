import appLogo from "../assets/logo.png";

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
      </div>
    </nav>
  );
};

export default Navbar;
