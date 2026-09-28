import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { Button } from "@/components/ui/Button";
import { PendingOrderRefresher } from "@/components/cart/PendingOrderRefresher";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const order = sessionId
    ? await prisma.order.findUnique({ where: { stripeCheckoutSessionId: sessionId } })
    : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center sm:px-8">
        <h1 className="text-xl font-bold text-navy">We couldn&apos;t find that order</h1>
        <p className="mt-2 text-sm text-navy/55">
          If you just paid, this can take a few seconds — refresh this page, or check your order history.
        </p>
        <Link href="/account/orders" className="mt-6 inline-block">
          <Button variant="outline">View order history</Button>
        </Link>
      </div>
    );
  }

  const paid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center sm:px-8">
      {paid ? (
        <CheckCircle2 size={44} className="mx-auto mb-4 text-emerald-500" />
      ) : (
        <Clock size={44} className="mx-auto mb-4 text-gold-600" />
      )}
      <h1 className="text-xl font-bold text-navy">
        {paid ? "Payment received" : "Confirming your payment..."}
      </h1>
      <p className="mt-2 text-sm text-navy/55">
        {paid
          ? `Order ${order.orderNumber} is confirmed. A receipt has been sent to ${order.customerEmail}.`
          : "This usually finishes within a few seconds. Refresh the page if it doesn't update."}
      </p>
      <p className="mt-4 text-2xl font-extrabold text-navy">{formatCents(order.totalCents, order.currency)}</p>
      <Link href={`/account/orders/${order.orderNumber}`} className="mt-6 inline-block">
        <Button>View order</Button>
      </Link>
      {!paid && <PendingOrderRefresher />}
    </div>
  );
}
