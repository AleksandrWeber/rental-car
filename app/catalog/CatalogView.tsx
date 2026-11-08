"use client";

import Image from "next/image";
import { useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CarCard } from "@/components/CarCard/CarCard";
import { Filters } from "@/components/Filters/Filters";
import { Spinner } from "@/components/Spinner/Spinner";
import { CARS_PER_PAGE, getCars, getFilters } from "@/services/cars";
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
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const cars = carsQuery.data?.pages.flatMap((page) => page.cars) ?? [];
  const isInitialLoading = carsQuery.isLoading;
  const showSkeleton =
    !carsQuery.isError && cars.length === 0 && carsQuery.isFetching;
  const isUpdating =
    carsQuery.isFetching &&
    !carsQuery.isFetchingNextPage &&
    !isInitialLoading &&
    cars.length > 0;

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

      <div className={styles.results}>
        {isUpdating ? (
          <p className={styles.updating} role="status">
            <Spinner />
            <span>Updating catalog</span>
          </p>
        ) : null}

        {showSkeleton ? (
          <div className={styles.grid} aria-busy="true" aria-live="polite">
            <p className={styles.srOnly}>Loading cars</p>
            {Array.from({ length: CARS_PER_PAGE }, (_, index) => (
              <article key={index} className={styles.skeletonCard} aria-hidden="true">
                <div className={styles.skeletonBody}>
                  <div className={`${styles.skeletonImage} ${styles.shimmer}`} />
                  <div className={styles.skeletonInfo}>
                    <div className={`${styles.skeletonTitle} ${styles.shimmer}`} />
                    <div className={`${styles.skeletonSpecs} ${styles.shimmer}`} />
                  </div>
                </div>
                <div className={`${styles.skeletonButton} ${styles.shimmer}`} />
              </article>
            ))}
          </div>
        ) : null}

        {carsQuery.isError && cars.length === 0 ? (
          <div className={styles.status} role="alert">
            <h2>Could not load cars</h2>
            <p>Something went wrong while loading the catalog. Please try again.</p>
            <button
              type="button"
              onClick={() => carsQuery.refetch()}
              disabled={carsQuery.isFetching}
            >
              {carsQuery.isFetching ? <Spinner /> : null}
              Try again
            </button>
          </div>
        ) : null}

        {!showSkeleton && !carsQuery.isError && cars.length === 0 ? (
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
          <div className={styles.grid} aria-busy={isUpdating}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : null}
      </div>

      {carsQuery.hasNextPage ? (
        <button
          type="button"
          className={styles.loadMore}
          onClick={() => carsQuery.fetchNextPage()}
          disabled={carsQuery.isFetchingNextPage || carsQuery.isPlaceholderData}
          aria-busy={carsQuery.isFetchingNextPage}
        >
          {carsQuery.isFetchingNextPage ? (
            <>
              <Spinner />
              <span className={styles.srOnly}>Loading more cars</span>
            </>
          ) : null}
          Load more
        </button>
      ) : null}
    </section>
  );
}
