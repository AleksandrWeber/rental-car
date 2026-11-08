import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Find your perfect rental car | RentalCar",
  },
  description:
    "Reliable and budget-friendly rentals for any journey. View the RentalCar catalog and choose a car.",
};

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <Image
        className={styles.picture}
        src="/images/hero.png"
        alt="White sports car driving along a sunlit road"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1>Find your perfect rental car</h1>
        <p>Reliable and budget-friendly rentals for any journey</p>
        <Link href="/catalog" className={styles.cta}>
          View Catalog
        </Link>
      </div>
    </section>
  );
}
