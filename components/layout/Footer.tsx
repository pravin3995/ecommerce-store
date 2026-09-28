import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <footer className="bg-navy text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 sm:px-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="text-xl font-extrabold tracking-tight text-white">
            VOLTRIX<span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
            Original components, sourced and tested for builders, makers and product teams.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">Shop</p>
          <ul className="flex flex-col gap-2 text-sm">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`} className="hover:text-white">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">Account</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/account" className="hover:text-white">My account</Link></li>
            <li><Link href="/account/orders" className="hover:text-white">Order history</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link href="/register" className="hover:text-white">Create account</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">Company</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link href="/" className="hover:text-white">About Voltrix</Link></li>
            <li><Link href="/" className="hover:text-white">Bulk &amp; wholesale pricing</Link></li>
            <li><Link href="/" className="hover:text-white">Shipping &amp; returns</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/45 sm:px-8">
        &copy; {new Date().getFullYear()} Voltrix Components. An original demo storefront — not affiliated with any real distributor.
      </div>
    </footer>
  );
}
