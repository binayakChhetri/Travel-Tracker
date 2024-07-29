import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ cityInfo }) {
  const { cityName, emoji, date, id, position } = cityInfo;
  const { currentCity, deleteCity } = useCities();

  function handleDelCity(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <Link
      className={`${styles.cityItem} ${
        currentCity.id === id ? styles["cityItem--active"] : ""
      }`}
      to={`${id}?lat=${position.lat}&lng=${position.lng}`}
    >
      <li>
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            handleDelCity(e);
          }}
        >
          &times;
        </button>
      </li>
    </Link>
  );
}

export default CityItem;
