import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider } from "./components/authentication/AuthContext";
import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AuthenticationPage from "./components/authentication/AuthenticationPage";
import Header from "./header/Header";
import AppointmentsPage from "./components/appointments/AppointmentsPage";
import ClinicsPage from "./components/clinics/ClinicsPage";
import NotFoundPage from "./components/notfound/NotFoundPage";
import { AuthContext } from "./components/authentication/AuthContext";
import { useContext } from "react";

function InnerApp() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/authenticate";
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {!isAuthPage && <Header />}
      <div className="container mt-5">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/authenticate" element={<AuthenticationPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />
          </Route>

          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/appointments" : "/authenticate"}
                replace
              />
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <InnerApp />
      </Router>
    </AuthProvider>
  );
}
export default App;
