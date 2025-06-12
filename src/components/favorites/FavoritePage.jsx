import { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";
import FavoriteService from "../../service/FavoriteService";
import styles from "./FavoritePage.module.css";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const clientId = parseInt(localStorage.getItem("clientId"));

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await FavoriteService.getFavorites(clientId);
      setFavorites(data);
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
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default FavoritePage;