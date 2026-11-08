import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested does not exist.",
};

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <h1>Page not found</h1>
      <p>The page you are looking for is unavailable.</p>
      <Link href="/catalog">Back to catalog</Link>
    </section>
  );
}
