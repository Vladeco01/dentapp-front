import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthenticationPage from "./components/AuthenticationPage";
import AppointmentsPage from "./components/AppointmentsPage";

function App() {
  return (
    <Router>
      <Navbar />
          <Routes>
            <Route path="/authenticate" element={<AuthenticationPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
           <Route path="/clinics" element={<div>Clinics Page</div>} />
        </Routes>
</Router>

  );
}

export default App;
