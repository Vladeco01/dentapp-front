import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header/Header";
import AuthenticationPage from "./components/AuthenticationPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import AppointmentsPage from "./components/appointments/AppointmentsPage";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Routes>
          <Route path="/authenticate" element={<AuthenticationPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/clinics" element={<div>Clinics Page</div>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
