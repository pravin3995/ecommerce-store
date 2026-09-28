import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, LogOut } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/account");

  const orderCount = await prisma.order.count({ where: { userId: user.id } });

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:px-8">
      <h1 className="text-2xl font-extrabold text-navy">My account</h1>

      <div className="mt-6 rounded-xl border border-navy/10 bg-white p-6 shadow-card">
        <p className="text-sm text-navy/50">Name</p>
        <p className="text-base font-semibold text-navy">{user.name}</p>
        <p className="mt-4 text-sm text-navy/50">Email</p>
        <p className="text-base font-semibold text-navy">{user.email}</p>
      </div>

      <Link
        href="/account/orders"
        className="mt-4 flex items-center justify-between rounded-xl border border-navy/10 bg-white p-6 shadow-card hover:border-accent/40"
      >
        <div className="flex items-center gap-3">
          <Package size={20} className="text-accent" />
          <div>
            <p className="text-sm font-semibold text-navy">Order history</p>
            <p className="text-xs text-navy/50">{orderCount} order{orderCount === 1 ? "" : "s"}</p>
          </div>
        </div>
        <span className="text-navy/40">&rarr;</span>
      </Link>

      <form action={logoutAction} className="mt-6">
        <Button type="submit" variant="outline">
          <LogOut size={16} />
          Sign out
        </Button>
      </form>
    </div>
  );
}
