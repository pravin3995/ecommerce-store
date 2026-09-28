import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
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

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Order history</h1>

      {orders.length === 0 ? (
        <div className="mt-10 text-center">
          <Package size={32} className="mx-auto mb-3 text-navy/30" />
          <p className="text-sm text-navy/55">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-navy/10 rounded-xl border border-navy/10 bg-white shadow-card">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="flex items-center justify-between gap-4 p-5 hover:bg-navy/[0.02]"
            >
              <div>
                <p className="text-sm font-semibold text-navy">{order.orderNumber}</p>
                <p className="text-xs text-navy/50">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <Badge tone={STATUS_TONE[order.status as keyof typeof STATUS_TONE] ?? "neutral"}>
                {order.status}
              </Badge>
              <p className="text-sm font-bold text-navy">{formatCents(order.totalCents, order.currency)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
