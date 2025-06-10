import { useEffect, useState } from "react";
import axios from "axios";
import { Container, ListGroup } from "react-bootstrap";
import styles from "./ClinicsPage.module.css";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  //   const clientId = parseInt(localStorage.getItem("clientId"));

  useEffect(() => {
    getClinics();
  }, []);

  const getClinics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/clinics/get-clinics`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setClinics(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className={styles.clinicContainer}>
      <h2 className="mb-4">Clinici</h2>
      <ListGroup as="ul">
        {clinics.map((cns) => (
          <ListGroup.Item as="li" key={cns.id} className={styles.clinicItem}>
            <div className={styles.clinicDetails}>
              <span>
                <strong>Nume: </strong> {cns.name}
              </span>
              <span>
                <strong> Strada: </strong> {cns.address}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};
export default ClinicsPage;
