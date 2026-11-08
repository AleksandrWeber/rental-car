import styles from "./details.module.css";

export default function CarLoading() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <p className={styles.back}>Loading car details...</p>
    </div>
  );
}
