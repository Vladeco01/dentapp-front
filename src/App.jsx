import { Routes, Route, Router } from "react-router-dom";
import AuthenticationPage from "./components/AuthenticationPage";
import Header from "./header/Header";
function App() {
  return (
    <Router>
      <Header />
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
