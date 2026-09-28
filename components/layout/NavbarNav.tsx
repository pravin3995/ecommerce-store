"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

export type NavCategory = {
  slug: string;
  name: string;
  products: { slug: string; name: string; images: string[] }[];
};

export function CategoryNavBar({ categories }: { categories: NavCategory[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Product categories">
      {categories.map((category) => (
        <div
          key={category.slug}
          className="relative"
          onMouseEnter={() => setOpenSlug(category.slug)}
          onMouseLeave={() => setOpenSlug((current) => (current === category.slug ? null : current))}
        >
          <Link
            href={`/category/${category.slug}`}
            className="flex items-center gap-1 rounded-md px-3 py-2.5 text-sm font-medium text-navy hover:bg-navy/5"
          >
            {category.name}
            <ChevronDown size={14} className="text-navy/50" />
          </Link>

          {openSlug === category.slug && category.products.length > 0 && (
            <div className="absolute left-0 top-full z-40 w-[320px] rounded-xl border border-navy/10 bg-white p-4 shadow-card">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-navy/45">
                Popular in {category.name}
              </p>
              <ul className="grid gap-1">
                {category.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/product/${product.slug}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-navy/5"
                    >
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-navy/5">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt="" fill sizes="36px" className="object-cover" />
                        )}
                      </span>
                      <span className="text-sm text-navy/80">{product.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/category/${category.slug}`}
                className="mt-2 block rounded-lg px-2 py-1.5 text-sm font-semibold text-accent hover:bg-accent/5"
              >
                View all {category.name} &rarr;
              </Link>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

export function MobileMenuButton({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden cursor-pointer rounded-md p-2 text-navy"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-navy p-6 text-white lg:hidden">
          <button
            className="mb-6 self-end cursor-pointer rounded-md p-2"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-1 overflow-y-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-lg font-semibold hover:bg-white/5"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
