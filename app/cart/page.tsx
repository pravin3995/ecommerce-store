import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateCart, computeCartTotals } from "@/lib/cart";
import { parseImages } from "@/lib/products";
import { formatCents } from "@/lib/money";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/Button";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/constants";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center sm:px-8">
        <ShoppingBag size={36} className="mx-auto mb-4 text-navy/30" />
        <h1 className="text-xl font-bold text-navy">Sign in to view your cart</h1>
        <p className="mt-2 text-sm text-navy/55">Your cart is saved to your account so it&apos;s there whenever you come back.</p>
        <Link href="/login?returnTo=/cart" className="mt-6 inline-block">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  const cart = await getOrCreateCart(user.id);
  const { subtotalCents, shippingCents, totalCents } = computeCartTotals(cart.items);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center sm:px-8">
        <ShoppingBag size={36} className="mx-auto mb-4 text-navy/30" />
        <h1 className="text-xl font-bold text-navy">Your cart is empty</h1>
        <p className="mt-2 text-sm text-navy/55">Browse the catalog and add parts to get started.</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={{
                productId: item.productId,
                slug: item.product.slug,
                name: item.product.name,
                image: parseImages(item.product.images)[0],
                unitPriceCents: item.product.priceCents,
                currency: item.product.currency,
                quantity: item.quantity,
                stockQty: item.product.stockQty,
              }}
            />
          ))}
        </div>

        <div className="h-fit rounded-xl border border-navy/10 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy/60">Order summary</h2>
          <div className="flex justify-between text-sm text-navy/70">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-navy/70">
            <span>Shipping</span>
            <span>{shippingCents === 0 ? "Free" : formatCents(shippingCents)}</span>
          </div>
          {shippingCents > 0 && (
            <p className="mt-2 text-xs text-navy/45">
              Add {formatCents(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} more for free shipping.
            </p>
          )}
          <div className="mt-4 flex justify-between border-t border-navy/10 pt-4 text-base font-bold text-navy">
            <span>Total</span>
            <span>{formatCents(totalCents)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
