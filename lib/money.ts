import { CURRENCY } from "@/lib/constants";

export function formatCents(cents: number, currency = CURRENCY): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    // Show ₹1,499 rather than ₹1,499.00; keep paise when there are any.
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
