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
import AdminRoute from "./components/routes/AdminRoute";
import AuthenticationPage from "./components/authentication/AuthenticationPage";
import Header from "./header/Header";
import AppointmentsPage from "./components/appointments/AppointmentsPage";
import ClinicsPage from "./components/clinics/ClinicsPage";
import NotFoundPage from "./components/notfound/NotFoundPage";
import { AuthContext } from "./components/authentication/AuthContext";
import { useContext, useEffect } from "react";
import FavoritePage from "./components/favorites/FavoritePage";
import ProfilePage from "./components/profile/ProfilePage";
import AdminPage from "./components/admin/AdminPage";

function InnerApp() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/authenticate";
  const { isAuthenticated } = useContext(AuthContext);

  const minimalHeader = isAuthPage || !isAuthenticated;

  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add("auth-page");
    } else {
      document.body.classList.remove("auth-page");
    }
  }, [isAuthPage]);

  return (
    <>
      <Header minimal={minimalHeader} />
      <div className="container mt-5">
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/authenticate" element={<AuthenticationPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/clinics" element={<ClinicsPage />} />
            <Route path="/favorites" element={<FavoritePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route
            path="/"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? localStorage.getItem("role") === "ADMIN"
                      ? "/admin"
                      : "/appointments"
                    : "/authenticate"
                }
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
