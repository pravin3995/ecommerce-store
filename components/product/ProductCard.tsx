import Link from "next/link";
import Image from "next/image";
import { formatCents } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    sku: string;
    priceCents: number;
    currency: string;
    stockQty: number;
    images: string[];
  };
};

export function ProductCard({ product }: Props) {
  const inStock = product.stockQty > 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-navy/10 bg-white shadow-card transition-shadow hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-navy/[0.03]">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-navy/45">
          {product.brand} &middot; {product.sku}
        </p>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold text-navy hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <Badge tone={inStock ? "success" : "danger"}>{inStock ? "In stock" : "Out of stock"}</Badge>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-navy">{formatCents(product.priceCents, product.currency)}</span>
          <AddToCartButton productId={product.id} returnTo={`/product/${product.slug}`} disabled={!inStock} compact />
        </div>
      </div>
    </div>
  );
}
