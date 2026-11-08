import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm/BookingForm";
import { Icon } from "@/components/Icon/Icon";
import { formatMileage, formatPrice } from "@/lib/format";
import { ApiError, getCar } from "@/services/cars";
import styles from "./details.module.css";

type CarPageProps = {
  params: Promise<{ carId: string }>;
};

export async function generateMetadata({
  params,
}: CarPageProps): Promise<Metadata> {
  const { carId } = await params;

  try {
    const car = await getCar(carId);
    return {
      title: `${car.brand} ${car.model}`,
      description: car.description,
    };
  } catch {
    return {
      title: "Car not found",
      description: "This rental car is unavailable.",
    };
  }
}

export default async function CarDetailsPage({ params }: CarPageProps) {
  const { carId } = await params;

  let car;
  try {
    car = await getCar(carId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const location = `${car.location.city}, ${car.location.country}`;
  const specifications = [
    { icon: "calendar" as const, label: `Year: ${car.year}` },
    { icon: "car" as const, label: `Type: ${car.type}` },
    {
      icon: "fuel" as const,
      label: `Fuel Consumption: ${car.fuelConsumption}`,
    },
    { icon: "gear" as const, label: `Engine: ${car.engine}` },
    {
      icon: "road" as const,
      label: `Mileage: ${formatMileage(car.mileage)} km`,
    },
  ];

  return (
    <article className={styles.page}>
      <p className={styles.back}>
        <Link href="/catalog">Back to catalog</Link>
      </p>
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.imageWrap}>
            <Image
              src={car.img}
              alt={`${car.brand} ${car.model}`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1100px) 100vw, 640px"
              className={styles.photo}
            />
          </div>
          <BookingForm carId={car.id} />
        </div>
        <section className={styles.info}>
          <div className={styles.summary}>
            <div className={styles.titleRow}>
              <h1>
                {car.brand} {car.model}, {car.year}
              </h1>
              {typeof car.stockNumber === "number" ? (
                <p className={styles.article}>Article: {car.stockNumber}</p>
              ) : null}
            </div>
            <p className={styles.location}>
              <Icon name="location" />
              <span>{location}</span>
            </p>
            <p className={styles.price}>{formatPrice(car.rentalPrice)}</p>
            <p className={styles.description}>{car.description}</p>
          </div>

          <div className={styles.block}>
            <h2>Rental Conditions:</h2>
            <ul>
              {car.rentalConditions.map((condition) => (
                <li key={condition}>
                  <Icon name="check" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className={styles.block}>
            <h2>Car Specifications:</h2>
            <ul>
              {specifications.map((item) => (
                <li key={item.label}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className={styles.block}>
            <h2>Features</h2>
            <ul>
              {car.features.map((feature) => (
                <li key={feature}>
                  <Icon name="check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}
