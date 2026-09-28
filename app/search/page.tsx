import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q ?? "").trim();

  // SQLite's Prisma provider has no case-insensitive `contains` mode, and the
  // catalog is small, so filter case-insensitively in-process instead.
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  if (query) {
    const needle = query.toLowerCase();
    const all = await prisma.product.findMany({ where: { isActive: true } });
    products = all
      .filter((p) =>
        [p.name, p.brand, p.sku, p.shortDescription].some((field) => field.toLowerCase().includes(needle))
      )
      .slice(0, 40);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Search</p>
      <h1 className="mt-2 text-2xl font-extrabold text-navy">
        {query ? `Results for "${query}"` : "Search Voltrix Components"}
      </h1>
      <p className="mt-2 text-sm text-navy/50">
        {query ? `${products.length} result${products.length === 1 ? "" : "s"}` : "Try a part name, brand or SKU."}
      </p>

      {query && products.length === 0 && (
        <p className="mt-12 text-sm text-navy/50">No products matched your search.</p>
      )}

      {products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, images: parseImages(product.images) }} />
          ))}
        </div>
      )}
    </div>
  );
}
