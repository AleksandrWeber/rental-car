"use client";

import Image from "next/image";
import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard/CarCard";
import { Filters } from "@/components/Filters/Filters";
import { getCars, getFilters } from "@/services/cars";
import type { CatalogFilters } from "@/types/car";
import styles from "./catalog.module.css";

const EMPTY_FILTERS: CatalogFilters = {};

export function CatalogView() {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);

  const filtersQuery = useQuery({
    queryKey: ["car-filters"],
    queryFn: getFilters,
  });

  const carsQuery = useInfiniteQuery({
    queryKey: ["cars", filters],
    queryFn: ({ pageParam }) => getCars(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const cars = carsQuery.data?.pages.flatMap((page) => page.cars) ?? [];

  return (
    <section className={styles.page}>
      <h1 className={styles.srOnly}>Car catalog</h1>
      <Filters
        meta={filtersQuery.data}
        metaLoading={filtersQuery.isLoading}
        value={filters}
        onSearch={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      {carsQuery.isLoading ? (
        <div className={styles.grid} aria-busy="true" aria-live="polite">
          <p className={styles.srOnly}>Loading cars</p>
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      ) : null}

      {carsQuery.isError ? (
        <div className={styles.status} role="alert">
          <h2>Could not load cars</h2>
          <p>Something went wrong while loading the catalog. Please try again.</p>
          <button type="button" onClick={() => carsQuery.refetch()}>
            Try again
          </button>
        </div>
      ) : null}

      {!carsQuery.isLoading && !carsQuery.isError && cars.length === 0 ? (
        <div className={styles.empty}>
          <Image src="/images/empty.png" alt="" width={320} height={300} />
          <h2>No cars found</h2>
          <p>
            We couldn&apos;t find any cars that match your current filters. Try
            changing your search criteria or reset the filters.
          </p>
        </div>
      ) : null}

      {cars.length > 0 ? (
        <div className={styles.grid}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : null}

      {carsQuery.hasNextPage ? (
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => carsQuery.fetchNextPage()}
          disabled={carsQuery.isFetchingNextPage}
        >
          {carsQuery.isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      ) : null}
    </section>
  );
}
