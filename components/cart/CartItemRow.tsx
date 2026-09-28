"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { formatCents } from "@/lib/money";
import { updateCartItemAction, removeCartItemAction } from "@/actions/cart.actions";

type Props = {
  item: {
    productId: string;
    slug: string;
    name: string;
    image?: string;
    unitPriceCents: number;
    currency: string;
    quantity: number;
    stockQty: number;
  };
};

export function CartItemRow({ item }: Props) {
  const [isPending, startTransition] = useTransition();

  function updateQuantity(quantity: number) {
    const formData = new FormData();
    formData.set("productId", item.productId);
    formData.set("quantity", String(quantity));
    startTransition(() => updateCartItemAction(formData));
  }

  function remove() {
    const formData = new FormData();
    formData.set("productId", item.productId);
    startTransition(() => removeCartItemAction(formData));
  }

  return (
    <div className={`flex items-center gap-4 py-5 ${isPending ? "opacity-50" : ""}`}>
      <Link href={`/product/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-navy/[0.03]">
        {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-semibold text-navy hover:text-accent">
          {item.name}
        </Link>
        <p className="mt-1 text-sm text-navy/50">{formatCents(item.unitPriceCents, item.currency)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={item.quantity}
          onChange={(e) => updateQuantity(Number(e.target.value))}
          disabled={isPending}
          aria-label={`Quantity for ${item.name}`}
          className="cursor-pointer rounded-md border border-navy/15 px-2 py-1.5 text-sm text-navy"
        >
          {Array.from({ length: Math.min(item.stockQty, 10) || 1 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={remove}
          disabled={isPending}
          aria-label={`Remove ${item.name} from cart`}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-navy/40 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={17} />
        </button>
      </div>

      <p className="w-24 shrink-0 text-right text-sm font-bold text-navy">
        {formatCents(item.unitPriceCents * item.quantity, item.currency)}
      </p>
    </div>
  );
}
