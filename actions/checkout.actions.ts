"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateCart, computeCartTotals } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/orders";
import { CURRENCY } from "@/lib/constants";

export type CheckoutState = { error?: string } | undefined;

export async function createCheckoutSession(
  _prevState: CheckoutState,
  _formData: FormData
): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/checkout");

  const cart = await getOrCreateCart(user.id);
  if (cart.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  for (const item of cart.items) {
    if (!item.product.isActive || item.product.stockQty < item.quantity) {
      return { error: `${item.product.name} is no longer available in the quantity requested.` };
    }
  }

  const { subtotalCents, shippingCents, totalCents } = computeCartTotals(cart.items);
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user.id,
      status: "PENDING",
      subtotalCents,
      shippingCents,
      totalCents,
      currency: CURRENCY,
      customerEmail: user.email,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productSku: item.product.sku,
          unitPriceCents: item.product.priceCents,
          quantity: item.quantity,
          lineTotalCents: item.product.priceCents * item.quantity,
        })),
      },
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let session;
  try {
    session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: cart.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: CURRENCY,
          unit_amount: item.product.priceCents,
          product_data: {
            name: item.product.name,
            metadata: { sku: item.product.sku },
          },
        },
      })),
      shipping_options:
        shippingCents > 0
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: { amount: shippingCents, currency: CURRENCY },
                  display_name: "Standard shipping",
                },
              },
            ]
          : undefined,
      shipping_address_collection: { allowed_countries: ["IN"] },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: { orderId: order.id, orderNumber },
    });
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    const message = err instanceof Error ? err.message : "Could not start checkout.";
    return { error: `Payment could not be started: ${message}` };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  if (!session.url) {
    return { error: "Stripe did not return a checkout URL. Please try again." };
  }

  redirect(session.url);
}
