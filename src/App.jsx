import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthenticationPage from "./components/AuthenticationPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/authenticate" element={<AuthenticationPage />} />
          <Route path="/appointments" element={<div>Appointments Page</div>} />
          <Route path="/clinics" element={<div>Clinics Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
