import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";

const STATUS_TONE = {
  PENDING: "gold",
  PAID: "success",
  FULFILLED: "success",
  CANCELLED: "danger",
} as const;

export default async function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?returnTo=/account/orders/${params.orderNumber}`);

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });

  if (!order || order.userId !== user.id) notFound();

  const address = [order.shippingLine1, order.shippingLine2, order.shippingCity, order.shippingState, order.shippingPostalCode, order.shippingCountry]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <Link href="/account/orders" className="text-sm text-navy/50 hover:text-navy">
        &larr; Order history
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-navy">{order.orderNumber}</h1>
        <Badge tone={STATUS_TONE[order.status as keyof typeof STATUS_TONE] ?? "neutral"}>{order.status}</Badge>
      </div>
      <p className="mt-1 text-sm text-navy/50">Placed {order.createdAt.toLocaleString()}</p>

      <div className="mt-8 rounded-xl border border-navy/10 bg-white shadow-card">
        <div className="divide-y divide-navy/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-5 text-sm">
              <div>
                <p className="font-semibold text-navy">{item.productName}</p>
                <p className="text-navy/50">SKU {item.productSku} &middot; Qty {item.quantity}</p>
              </div>
              <p className="font-bold text-navy">{formatCents(item.lineTotalCents, order.currency)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-navy/10 p-5 text-sm">
          <div className="flex justify-between text-navy/70">
            <span>Subtotal</span>
            <span>{formatCents(order.subtotalCents, order.currency)}</span>
          </div>
          <div className="flex justify-between text-navy/70">
            <span>Shipping</span>
            <span>{order.shippingCents === 0 ? "Free" : formatCents(order.shippingCents, order.currency)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-navy">
            <span>Total</span>
            <span>{formatCents(order.totalCents, order.currency)}</span>
          </div>
        </div>
      </div>

      {address && (
        <div className="mt-6 rounded-xl border border-navy/10 bg-white p-5 shadow-card">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy/60">Shipping to</h2>
          <p className="text-sm text-navy/75">{order.shippingName}</p>
          <p className="text-sm text-navy/75">{address}</p>
        </div>
      )}
    </div>
  );
}
