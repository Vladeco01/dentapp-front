const appointmentData = [
    {
      id: 1,
      doctorName: "George Malaescu",
      clinicName: "Malaclinic",
      startDate: "2025-05-18 18:00:00",
      endDate: "2025-05-18 18:30:00",
      description: "detartraj",
      status: "Waiting",
      createdAt: "2025-05-14 13:00:00"
    },
    {
      id: 2,
      doctorName: "Mihai Matache",
      clinicName: "Mataclinic",
      startDate: "2025-05-20 08:00:00",
      endDate: "2025-05-20 09:00:00",
      description: "plomba",
      status: "Accepted",
      createdAt: "2025-05-11 14:00:00"
    },
    {
      id: 3,
      doctorName: "Andrei Popescu",
      clinicName: "Popeclinic",
      startDate: "2025-05-16 16:00:00",
      endDate: "2025-05-16 16:30:00",
      description: "detartraj",
      status: "Denied",
      createdAt: "2025-05-09 08:25:31"
    },
    {
      id: 4,
      doctorName: "Alex Dumitru",
      clinicName: "Dumiclinic",
      startDate: "2025-05-11 14:00:00",
      endDate: "2025-05-11 15:00:00",
      description: "albire",
      status: "Accepted",
      createdAt: "2025-05-10 12:00:00"
    }
  ];
  
  const AppointmentsPage = () => {
    const appointments = appointmentData;
  
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <ul className="list-group list-group-flush">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="card p-7 shadow mb-1">
                <h2>{appointment.clinicName}</h2>
                <h3>{appointment.doctorName}</h3>
                <p>{appointment.description}</p>
                <p><strong>Start:</strong> {appointment.startDate}</p>
                <p><strong>End:</strong> {appointment.endDate}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </li>
            ))}
          </ul>
        </div>
    );
  };
  
  export default AppointmentsPage;
  