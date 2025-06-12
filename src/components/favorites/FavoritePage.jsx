import { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";
import FavoriteService from "../../service/FavoriteService";
import styles from "./FavoritePage.module.css";
import ClinicService from "../../service/ClinicService";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const clientId = parseInt(localStorage.getItem("clientId"));
  const [clinicMap, setClinicMap] = useState({});

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await FavoriteService.getFavorites(clientId);
      setFavorites(data);
      data.forEach((fav) => fetchClinic(fav.id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClinic = async (dentistId) => {
    try {
      const info = await ClinicService.getClinicForDentist(dentistId);
      setClinicMap((prev) => ({ ...prev, [dentistId]: info }));
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <Container className={styles.favoritesContainer}>
      <h2 className="mb-4">Favorite</h2>
      <ListGroup as="ul">
        {favorites.map((fav) => (
          <ListGroup.Item
            as="li"
            key={fav.id}
            className={styles.favoriteItem}
          >
            <h4>{fav.firstName} {fav.lastName}</h4>
            <span>Email: {fav.email}</span>
            <br></br>
            <span>{clinicMap[fav.id] && clinicMap[fav.id]}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default FavoritePage;