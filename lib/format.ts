export function formatMileage(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatPrice(value: string | number): string {
  return `$${value}`;
}

export function priceOptions(min: number, max: number): number[] {
  const start = Math.ceil(min / 10) * 10;
  const end = Math.floor(max / 10) * 10;
  const options: number[] = [];

  for (let price = start; price <= end; price += 10) {
    options.push(price);
  }

  if (options.length === 0 && min <= max) {
    options.push(min);
  }

  return options;
}

export function parseMileage(value: string): number | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return undefined;
  }
  return Number(digits);
}
