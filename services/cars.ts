import type {
  BookingPayload,
  BookingResponse,
  Car,
  CarsResponse,
  CatalogFilters,
  FiltersMeta,
} from "@/types/car";

export const API_BASE_URL = "https://car-rental-api.goit.study";
export const CARS_PER_PAGE = 12;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed. Please try again.";
    try {
      const body: unknown = await response.json();
      if (
        body &&
        typeof body === "object" &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      // Keep the fallback message when the error body is not JSON.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export function buildCarsSearchParams(
  filters: CatalogFilters,
  page: number,
  perPage = CARS_PER_PAGE,
): string {
  const params = new URLSearchParams();

  if (filters.brand) {
    params.set("brand", filters.brand);
  }
  if (typeof filters.price === "number") {
    params.set("price", String(filters.price));
  }
  if (typeof filters.minMileage === "number") {
    params.set("minMileage", String(filters.minMileage));
  }
  if (typeof filters.maxMileage === "number") {
    params.set("maxMileage", String(filters.maxMileage));
  }

  params.set("perPage", String(perPage));
  params.set("page", String(page));

  return params.toString();
}

export function getCars(filters: CatalogFilters, page: number) {
  return request<CarsResponse>(
    `/cars?${buildCarsSearchParams(filters, page)}`,
  );
}

export function getFilters() {
  return request<FiltersMeta>("/cars/filters");
}

export function getCar(id: string) {
  return request<Car>(`/cars/${encodeURIComponent(id)}`);
}

export function createBooking(carId: string, payload: BookingPayload) {
  return request<BookingResponse>(
    `/cars/${encodeURIComponent(carId)}/booking-requests`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
