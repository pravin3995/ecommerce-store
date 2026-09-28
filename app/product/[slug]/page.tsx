import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { parseImages, parseSpecs } from "@/lib/products";
import { formatCents } from "@/lib/money";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });
  if (!product || !product.isActive) notFound();

  const images = parseImages(product.images);
  const specs = parseSpecs(product.specs);
  const inStock = product.stockQty > 0;

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    take: 4,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
      <nav className="mb-6 text-xs text-navy/50">
        <Link href="/" className="hover:text-navy">Home</Link>
        {" / "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-navy">
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-navy/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="grid gap-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-navy/[0.03]">
            {images[0] && (
              <Image src={images[0]} alt={product.name} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" priority />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-navy/[0.03]">
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-navy/45">
            {product.brand} &middot; SKU {product.sku}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <Badge tone={inStock ? "success" : "danger"}>
              {inStock ? `In stock — ${product.stockQty} available` : "Out of stock"}
            </Badge>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-navy">
            {formatCents(product.priceCents, product.currency)}
          </p>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-navy/65">{product.description}</p>

          <div className="mt-6">
            <AddToCartButton productId={product.id} returnTo={`/product/${product.slug}`} disabled={!inStock} />
          </div>

          {Object.keys(specs).length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy/70">Specifications</h2>
              <dl className="divide-y divide-navy/10 rounded-lg border border-navy/10">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                    <dt className="text-navy/55">{key}</dt>
                    <dd className="font-medium text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold text-navy">You might also need</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={{ ...p, images: parseImages(p.images) }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
