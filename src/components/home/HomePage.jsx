import { Container } from "react-bootstrap";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <Container className={styles.homeContainer}>
      <h2 className="mb-4">Bine ați venit la DentApp</h2>
      <p>
        DentApp este o aplicație creată pentru a ușura procesul de programare la
        medicul dentist. Prin intermediul ei puteți vedea clinicile disponibile,
        vă puteți face programări și urmări istoricul acestora.
      </p>
      <p>
        După autentificare, accesați secțiunile aplicației din meniul de sus
        pentru a descoperi toate funcționalitățile oferite.
      </p>
    </Container>
  );
};

export default HomePage;
