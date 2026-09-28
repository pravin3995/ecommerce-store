import Link from "next/link";
import { ShieldCheck, Zap, PackageCheck, BadgeDollarSign, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/products";
import { Button } from "@/components/ui/Button";
import { CategoryCard } from "@/components/category/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: PackageCheck, label: "Tested components" },
  { icon: Zap, label: "Fast dispatch" },
  { icon: BadgeDollarSign, label: "Bulk pricing available" },
];

const TESTIMONIALS = [
  {
    name: "Priya N.",
    role: "Robotics club lead",
    quote:
      "Order arrived faster than expected and every board powered up first try. Our go-to for competition season.",
  },
  {
    name: "Marcus T.",
    role: "Hardware engineer",
    quote:
      "Specs on the listing pages actually match the datasheet. Saved me from three separate wrong-part orders.",
  },
  {
    name: "Aditi R.",
    role: "Maker & educator",
    quote:
      "I buy in bulk for workshops. Stock counts are accurate and the checkout flow is refreshingly simple.",
  },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, take: 8 }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <section className="bg-navy">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Original components, sourced &amp; verified
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Powering every <span className="text-accent">build.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65">
              Microcontrollers, sensors, dev boards and modules — in stock, spec-checked, and
              shipped fast to labs, classrooms and workshops.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/category/microcontrollers-dev-boards">
                <Button size="lg">Shop dev boards</Button>
              </Link>
              <Link href="#categories">
                <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10">
                  Browse categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-navy/10 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:px-8 md:grid-cols-4">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={22} className="shrink-0 text-accent" />
              <span className="text-sm font-medium text-navy">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Shop by category</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Find your part faster.</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="bg-navy-2 bg-[#f5f6f8]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Featured</p>
                <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Popular this week.</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, images: parseImages(product.images) }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">What builders say</p>
          <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Trusted on the bench.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-navy/10 bg-white p-6 shadow-card">
              <div className="mb-3 flex gap-0.5 text-gold-600">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-navy/75">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-navy/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
