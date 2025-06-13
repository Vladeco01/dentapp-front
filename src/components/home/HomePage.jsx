import { Container, Button, Row, Col } from "react-bootstrap";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <Container fluid className={styles.homeContainer}>
      <section className={styles.hero}>
        <h1>Salut! Bine ai venit la DentApp</h1>
        <p>Programări la dentist rapid și fără bătăi de cap.</p>
        <Button variant="primary" href="/clinics" className={styles.ctaButton}>
          Programează-te acum!
        </Button>
      </section>

      <section className={styles.features}>
        <Row>
          <Col md={4} className={styles.feature}>
            <h3>Găsești clinici</h3>
            <p>
              Explorează cabinete locale și alege-l pe cel care ți se
              potrivește.
            </p>
          </Col>
          <Col md={4} className={styles.feature}>
            <h3>Verifici calendarul</h3>
            <p>Vezi rapid intervalele disponibile.</p>
          </Col>
          <Col md={4} className={styles.feature}>
            <h3>Urmărești istoricul</h3>
            <p>Ai mereu la îndemână toate programările trecute.</p>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default HomePage;
