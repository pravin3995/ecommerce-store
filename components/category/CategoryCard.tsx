import Link from "next/link";
import Image from "next/image";

type Props = {
  category: { slug: string; name: string; imageUrl: string | null };
};

export function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-navy"
    >
      {category.imageUrl && (
        <Image
          src={category.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-base font-bold text-white">{category.name}</p>
        <span className="text-xs font-semibold text-gold">Shop now &rarr;</span>
      </div>
    </Link>
  );
}
