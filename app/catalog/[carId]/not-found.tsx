import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../not-found.module.css";

export const metadata: Metadata = {
  title: "Car not found",
  description: "This car is not available in the rental catalog.",
};

export default function CarNotFound() {
  return (
    <section className={styles.wrap}>
      <h1>Car not found</h1>
      <p>This vehicle is unavailable or the link is incorrect.</p>
      <Link href="/catalog">Back to catalog</Link>
    </section>
  );
}
