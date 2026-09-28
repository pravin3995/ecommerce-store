import Link from "next/link";
import { Search, ShoppingCart, User as UserIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { parseImages } from "@/lib/products";
import { CategoryNavBar, MobileMenuButton } from "./NavbarNav";
import { logoutAction } from "@/actions/auth.actions";

export async function Navbar() {
  const [categories, user] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isActive: true },
          take: 4,
          orderBy: { isFeatured: "desc" },
        },
      },
    }),
    getCurrentUser(),
  ]);

  const navCategories = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    products: category.products.map((product) => ({
      slug: product.slug,
      name: product.name,
      images: parseImages(product.images),
    })),
  }));

  const cartCount = user
    ? await prisma.cartItem.count({ where: { cart: { userId: user.id } } })
    : 0;

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="bg-navy px-4 py-2 text-center text-xs text-white/80 sm:px-8">
        Free shipping on orders over $150 &middot; Original, tested components
      </div>

      <div className="border-b border-navy/10 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight text-navy">
            VOLTRIX<span className="text-accent">.</span>
          </Link>

          <form action="/search" method="get" className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
              <input
                type="search"
                name="q"
                placeholder="Search parts, SKUs, modules..."
                className="w-full rounded-full border border-navy/15 bg-navy/[0.03] py-2.5 pl-9 pr-4 text-sm text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                >
                  <UserIcon size={17} />
                  {user.name.split(" ")[0]}
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="cursor-pointer rounded-md px-2.5 py-2 text-sm text-navy/60 hover:bg-navy/5">
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-navy hover:bg-navy/5 sm:flex"
              >
                <UserIcon size={17} />
                Sign in
              </Link>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-navy hover:bg-navy/5"
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <MobileMenuButton categories={navCategories} />
          </div>
        </div>
      </div>

      <div className="hidden border-b border-navy/10 px-4 sm:px-8 lg:block">
        <div className="mx-auto max-w-7xl">
          <CategoryNavBar categories={navCategories} />
        </div>
      </div>
    </header>
  );
}
