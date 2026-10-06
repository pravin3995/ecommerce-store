import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

// Created lazily so a missing key fails the request that needs Stripe,
// not `next build` (which imports route modules while collecting page data).
export function getStripe(): Stripe {
  if (!client) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    client = new Stripe(secretKey, {
      apiVersion: "2026-08-26.dahlia",
    });
  }
  return client;
}
