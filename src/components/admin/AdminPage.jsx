import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Form } from "react-bootstrap";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [requests, setRequests] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [clinicSearch, setClinicSearch] = useState("");

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [newClinic, setNewClinic] = useState({ name: "", address: "" });

  const authHeader = {
    headers: { Authorization: localStorage.getItem("token") },
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchUsers();
    fetchAppointments();
    fetchClinics();
    fetchRequests();
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/users/getAll",
        authHeader
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/appointments/getAll",
        authHeader
      );
      const appointmentsWithNames = await Promise.all(
        res.data.map(async (appt) => {
          try {
            const [clientRes, dentistRes] = await Promise.all([
              axios.get(
                `http://localhost:8080/users/getUser/${appt.clientId}`,
                authHeader
              ),
              axios.get(
                `http://localhost:8080/users/getUser/${appt.dentistId}`,
                authHeader
              ),
            ]);

            return {
              ...appt,
              client: clientRes.data,
              dentist: dentistRes.data,
            };
          } catch (err) {
            console.error(err);
            return appt;
          }
        })
      );

      setAppointments(appointmentsWithNames);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClinics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/clinics/get-clinics",
        authHeader
      );
      setClinics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/role-change-requests",
        authHeader
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:8080/users", newUser, authHeader);
      setNewUser({ firstName: "", lastName: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, authHeader);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClinic = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/clinics/createClinic",
        newClinic,
        authHeader
      );
      setNewClinic({ name: "", address: "" });
      fetchClinics();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClinic = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/clinics/deleteClinic/${id}`,
        authHeader
      );
      fetchClinics();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/appointments/${id}`,
        authHeader
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/role-change-requests/${id}?status=${status}`,
        null,
        authHeader
      );
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  const filteredClinics = clinics.filter((c) =>
    c.name.toLowerCase().includes(clinicSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter((a) => {
    const client = a.client ? `${a.client.firstName} ${a.client.lastName}` : "";
    const dentist = a.dentist
      ? `${a.dentist.firstName} ${a.dentist.lastName}`
      : "";
    return (
      client.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      dentist.toLowerCase().includes(appointmentSearch.toLowerCase())
    );
  });

  return (
    <Container className="mb-5">
      <h2 className="my-4">Admin Dashboard</h2>

      <section className="mb-4">
        <h4>Users</h4>
        <Form.Control
          className="mb-2"
          placeholder="Search users"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <Table striped bordered hover size="sm" className="mb-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form className="d-flex gap-2">
          <Form.Control
            placeholder="First name"
            value={newUser.firstName}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
          />
          <Form.Control
            placeholder="Last name"
            value={newUser.lastName}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
          />
          <Form.Control
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Form.Control
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <Button onClick={handleAddUser}>Add</Button>
        </Form>
      </section>

      <section className="mb-4">
        <h4>Clinics</h4>
        <Form.Control
          className="mb-2"
          placeholder="Search clinics"
          value={clinicSearch}
          onChange={(e) => setClinicSearch(e.target.value)}
        />
        <Table striped bordered hover size="sm" className="mb-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredClinics.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.address}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClinic(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form className="d-flex gap-2">
          <Form.Control
            placeholder="Name"
            value={newClinic.name}
            onChange={(e) =>
              setNewClinic({ ...newClinic, name: e.target.value })
            }
          />
          <Form.Control
            placeholder="Address"
            value={newClinic.address}
            onChange={(e) =>
              setNewClinic({ ...newClinic, address: e.target.value })
            }
          />
          <Button onClick={handleAddClinic}>Add</Button>
        </Form>
      </section>

      <section className="mb-4">
        <h4>Appointments</h4>
        <Form.Control
          className="mb-2"
          placeholder="Search appointments"
          value={appointmentSearch}
          onChange={(e) => setAppointmentSearch(e.target.value)}
        />
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Dentist</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>
                  {a.client ? `${a.client.firstName} ${a.client.lastName}` : ""}
                </td>
                <td>
                  {a.dentist
                    ? `${a.dentist.firstName} ${a.dentist.lastName}`
                    : ""}
                </td>
                <td>{a.status}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteAppointment(a.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="mb-4">
        <h4>Role Change Requests</h4>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>
                  {r.client ? `${r.client.firstName} ${r.client.lastName}` : ""}
                </td>
                <td>{r.status}</td>
                <td className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => updateRequestStatus(r.id, "ACCEPTED")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => updateRequestStatus(r.id, "DENIED")}
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </Container>
  );
};

export default AdminPage;
