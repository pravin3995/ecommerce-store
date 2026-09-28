import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateCart, computeCartTotals } from "@/lib/cart";
import { formatCents } from "@/lib/money";
import { CheckoutButton } from "@/components/cart/CheckoutButton";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?returnTo=/checkout");

  const cart = await getOrCreateCart(user.id);
  if (cart.items.length === 0) redirect("/cart");

  const { subtotalCents, shippingCents, totalCents } = computeCartTotals(cart.items);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Checkout</h1>
      <p className="mt-1 text-sm text-navy/55">
        Signed in as {user.email}. You&apos;ll enter shipping and card details on Stripe&apos;s secure checkout page.
      </p>

      <div className="mt-8 rounded-xl border border-navy/10 bg-white p-6 shadow-card">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy/60">Order summary</h2>
        <div className="divide-y divide-navy/10">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium text-navy">{item.product.name}</p>
                <p className="text-navy/50">Qty {item.quantity}</p>
              </div>
              <p className="font-semibold text-navy">
                {formatCents(item.product.priceCents * item.quantity, item.product.currency)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-navy/10 pt-4 text-sm">
          <div className="flex justify-between text-navy/70">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-navy/70">
            <span>Shipping</span>
            <span>{shippingCents === 0 ? "Free" : formatCents(shippingCents)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-navy">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>
        </div>

        <div className="mt-6">
          <CheckoutButton />
        </div>
      </div>

      <Link href="/cart" className="mt-4 inline-block text-sm text-navy/50 hover:text-navy">
        &larr; Back to cart
      </Link>
    </div>
  );
}
