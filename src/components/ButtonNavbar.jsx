import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ButtonNavbar = ({ title, to }) => {
  return (
    <Link to={to} className="btn btn-outline-primary mx-2">
      {title}
    </Link>
  );
};

export default ButtonNavbar;
