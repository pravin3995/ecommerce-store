import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await handleCheckoutCompleted(orderId, session);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(orderId: string, session: Stripe.Checkout.Session) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.status === "PAID") return;

  const shipping = session.collected_information?.shipping_details ?? null;
  const address = shipping?.address ?? session.customer_details?.address ?? null;
  const shippingName = shipping?.name ?? session.customer_details?.name ?? null;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        shippingName: shippingName ?? undefined,
        shippingLine1: address?.line1 ?? undefined,
        shippingLine2: address?.line2 ?? undefined,
        shippingCity: address?.city ?? undefined,
        shippingState: address?.state ?? undefined,
        shippingPostalCode: address?.postal_code ?? undefined,
        shippingCountry: address?.country ?? undefined,
      },
    });

    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.product.updateMany({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cart: { userId: order.userId } },
    });
  });
}
