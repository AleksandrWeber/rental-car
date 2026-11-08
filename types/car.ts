export type CarLocation = {
  country: string;
  city: string;
  address: string;
};

export type Car = {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string | number;
  engine: string;
  features: string[];
  rentalPrice: string;
  rentalCompany: string;
  location: CarLocation;
  rentalConditions: string[];
  mileage: number;
  stockNumber?: number;
};

export type CarsResponse = {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
  perPage?: number;
};

export type FiltersMeta = {
  brands: string[];
  price: {
    min: number;
    max: number;
  };
};

export type CatalogFilters = {
  brand?: string;
  price?: number;
  minMileage?: number;
  maxMileage?: number;
};

export type BookingPayload = {
  name: string;
  email: string;
  comment?: string;
};

export type BookingResponse = {
  message: string;
};
