"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { parseMileage, priceOptions } from "@/lib/format";
import type { CatalogFilters, FiltersMeta } from "@/types/car";
import { Icon } from "@/components/Icon/Icon";
import styles from "./Filters.module.css";

type FiltersProps = {
  meta?: FiltersMeta;
  metaLoading: boolean;
  value: CatalogFilters;
  onSearch: (filters: CatalogFilters) => void;
  onClear: () => void;
};

type OpenMenu = "brand" | "price" | null;

type DraftFilters = {
  brand: string;
  price: number | "";
  minMileage: string;
  maxMileage: string;
};

const EMPTY_DRAFT: DraftFilters = {
  brand: "",
  price: "",
  minMileage: "",
  maxMileage: "",
};

function toDraft(value: CatalogFilters): DraftFilters {
  return {
    brand: value.brand ?? "",
    price: value.price ?? "",
    minMileage: value.minMileage !== undefined ? String(value.minMileage) : "",
    maxMileage: value.maxMileage !== undefined ? String(value.maxMileage) : "",
  };
}

export function Filters({
  meta,
  metaLoading,
  value,
  onSearch,
  onClear,
}: FiltersProps) {
  const [draft, setDraft] = useState<DraftFilters>(() => toDraft(value));
  const [open, setOpen] = useState<OpenMenu>(null);
  const [mileageError, setMileageError] = useState("");
  const rootRef = useRef<HTMLFormElement>(null);
  const brandId = useId();
  const priceId = useId();
  const minId = useId();
  const maxId = useId();

  useEffect(() => {
    setDraft(toDraft(value));
  }, [value]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const prices = meta ? priceOptions(meta.price.min, meta.price.max) : [];

  function updateDraft<Key extends keyof DraftFilters>(
    key: Key,
    nextValue: DraftFilters[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: nextValue }));
  }

  function onMileageChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value: raw } = event.target;

    if (name !== "minMileage" && name !== "maxMileage") {
      return;
    }

    updateDraft(name, raw.replace(/\D/g, ""));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const min = parseMileage(draft.minMileage);
    const max = parseMileage(draft.maxMileage);

    if (min !== undefined && max !== undefined && min > max) {
      setMileageError("Minimum mileage cannot be greater than maximum.");
      return;
    }

    setMileageError("");
    setOpen(null);
    onSearch({
      brand: draft.brand || undefined,
      price: draft.price === "" ? undefined : draft.price,
      minMileage: min,
      maxMileage: max,
    });
  }

  function clear() {
    setDraft(EMPTY_DRAFT);
    setMileageError("");
    setOpen(null);
    onClear();
  }

  return (
    <form ref={rootRef} className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={brandId}>
            Car brand
          </label>
          <div className={styles.selectWrap}>
            <button
              id={brandId}
              type="button"
              className={styles.select}
              aria-haspopup="listbox"
              aria-expanded={open === "brand"}
              disabled={metaLoading}
              onClick={() => setOpen((current) => (current === "brand" ? null : "brand"))}
            >
              <span>{draft.brand || "Choose a brand"}</span>
              <Icon
                name="chevron"
                className={open === "brand" ? styles.chevronOpen : undefined}
              />
            </button>
            {open === "brand" ? (
              <ul className={styles.menu} role="listbox" aria-label="Car brand">
                <li>
                  <button
                    type="button"
                    role="option"
                    aria-selected={draft.brand === ""}
                    className={draft.brand === "" ? styles.optionActive : styles.option}
                    onClick={() => {
                      updateDraft("brand", "");
                      setOpen(null);
                    }}
                  >
                    All cars
                  </button>
                </li>
                {(meta?.brands ?? []).map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option === draft.brand}
                      className={option === draft.brand ? styles.optionActive : styles.option}
                      onClick={() => {
                        updateDraft("brand", option);
                        setOpen(null);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className={styles.priceField}>
          <label className={styles.label} htmlFor={priceId}>
            Price/ 1 hour
          </label>
          <div className={styles.selectWrap}>
            <button
              id={priceId}
              type="button"
              className={styles.select}
              aria-haspopup="listbox"
              aria-expanded={open === "price"}
              disabled={metaLoading}
              onClick={() => setOpen((current) => (current === "price" ? null : "price"))}
            >
              <span>{draft.price === "" ? "Choose a price" : `To $${draft.price}`}</span>
              <Icon
                name="chevron"
                className={open === "price" ? styles.chevronOpen : undefined}
              />
            </button>
            {open === "price" ? (
              <ul className={`${styles.menu} ${styles.priceMenu}`} role="listbox" aria-label="Price per hour">
                {prices.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option === draft.price}
                      className={option === draft.price ? styles.optionActive : styles.option}
                      onClick={() => {
                        updateDraft("price", option);
                        setOpen(null);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <fieldset className={styles.mileage}>
          <legend className={styles.label}>Car mileage / km</legend>
          <div className={styles.mileageInputs}>
            <label className={styles.mileageBox} htmlFor={minId}>
              <span className={styles.srOnly}>Minimum mileage</span>
              <input
                id={minId}
                name="minMileage"
                inputMode="numeric"
                placeholder="From"
                value={draft.minMileage}
                onChange={onMileageChange}
              />
            </label>
            <label className={styles.mileageBox} htmlFor={maxId}>
              <span className={styles.srOnly}>Maximum mileage</span>
              <input
                id={maxId}
                name="maxMileage"
                inputMode="numeric"
                placeholder="To"
                value={draft.maxMileage}
                onChange={onMileageChange}
              />
            </label>
          </div>
        </fieldset>

        <button type="submit" className={styles.search}>
          Search
        </button>
      </div>
      {mileageError ? <p className={styles.mileageError}>{mileageError}</p> : null}
      <button type="button" className={styles.clear} onClick={clear}>
        Clear filters
      </button>
    </form>
  );
}
