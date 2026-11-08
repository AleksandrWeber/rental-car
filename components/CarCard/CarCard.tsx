import Image from "next/image";
import Link from "next/link";
import { formatMileage, formatPrice } from "@/lib/format";
import type { Car } from "@/types/car";
import styles from "./CarCard.module.css";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const specs = [
    car.location.city,
    car.location.country,
    car.rentalCompany,
  ];
  const secondary = [car.type, `${formatMileage(car.mileage)} km`];

  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div className={styles.imageWrap}>
          <Image
            src={car.img}
            alt={`${car.brand} ${car.model}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 276px"
            className={styles.photo}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>
              {car.brand} <span>{car.model}</span>, {car.year}
            </h2>
            <p className={styles.price}>{formatPrice(car.rentalPrice)}</p>
          </div>
          <div className={styles.specs}>
            <p className={styles.specLine}>
              {specs.map((item, index) => (
                <span key={`${item}-${index}`} className={styles.specItem}>
                  {index > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
                  {item}
                </span>
              ))}
            </p>
            <p className={styles.specLine}>
              {secondary.map((item, index) => (
                <span key={`${item}-${index}`} className={styles.specItem}>
                  {index > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
                  {item}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
      <Link
        href={`/catalog/${car.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.more}
      >
        Read more
      </Link>
    </article>
  );
}
