"use client";

import styles from "../../not-found.module.css";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function CarError({ reset }: ErrorProps) {
  return (
    <section className={styles.wrap}>
      <h1>Could not load this car</h1>
      <p>Something went wrong while loading the vehicle details.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
