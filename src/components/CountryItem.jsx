import styles from "./CountryItem.module.css";

function CountryItem({ countryInfo }) {
  return (
    <li className={styles.countryItem}>
      <span>{countryInfo.emoji}</span>
      <span>{countryInfo.country}</span>
    </li>
  );
}

export default CountryItem;
