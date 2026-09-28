import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: category.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Category</p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy">{category.name}</h1>
      {category.description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/60">{category.description}</p>
      )}
      <p className="mt-4 text-sm text-navy/50">
        {products.length} product{products.length === 1 ? "" : "s"}
      </p>

      {products.length === 0 ? (
        <p className="mt-12 text-sm text-navy/50">No products in this category yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, images: parseImages(product.images) }} />
          ))}
        </div>
      )}
    </div>
  );
}
