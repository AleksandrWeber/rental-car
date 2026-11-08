# RentalCar

RentalCar is a car rental catalog. Visitors can browse vehicles from the live API, filter the list, open a car in a new tab, and send a booking request.

## Features

- Home page with a catalog call to action
- Catalog with brand, hourly price, and mileage filters
- Load more pagination that keeps already loaded cars and the active filters
- Car details page that can be opened directly by URL
- Booking form with validation, a loading state, and a success message
- Loading, empty, and error states

## Technology stack

- Next.js App Router
- React
- TypeScript
- TanStack Query (`useInfiniteQuery` for the catalog)
- CSS Modules

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## API

The app uses the Rental Car API:

- Base URL: `https://car-rental-api.goit.study`
- `GET /cars`
- `GET /cars/filters`
- `GET /cars/{id}`
- `POST /cars/{carId}/booking-requests`

## Deployment

The project is a standard Next.js application and can be deployed to Vercel.

1. Push the repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Leave the framework preset as Next.js and the build command as `npm run build`.
4. Deploy. No environment variables are required.

## Author

Author: Oleksandr Shvachko

