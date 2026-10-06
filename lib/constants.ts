export const ROLES = ["CUSTOMER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Money amounts are in the currency's minor unit (paise for INR), despite
// the "Cents" naming.
export const SHIPPING_CENTS = 9900; // ₹99
export const FREE_SHIPPING_THRESHOLD_CENTS = 99900; // ₹999
export const SESSION_COOKIE_NAME = "voltrix_session";
export const CURRENCY = "inr";
