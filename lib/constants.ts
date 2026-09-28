export const ROLES = ["CUSTOMER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const SHIPPING_CENTS = 800;
export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const SESSION_COOKIE_NAME = "voltrix_session";
export const CURRENCY = "usd";
