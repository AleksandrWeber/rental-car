import type { Metadata } from "next";
import { CatalogView } from "./CatalogView";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse rental cars and filter by brand, price, and mileage. Open a car to see details and send a booking request.",
};

export default function CatalogPage() {
  return <CatalogView />;
}
