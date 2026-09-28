import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center sm:px-8">
      <XCircle size={44} className="mx-auto mb-4 text-navy/30" />
      <h1 className="text-xl font-bold text-navy">Checkout cancelled</h1>
      <p className="mt-2 text-sm text-navy/55">No payment was made. Your cart is still saved.</p>
      <Link href="/cart" className="mt-6 inline-block">
        <Button>Return to cart</Button>
      </Link>
    </div>
  );
}
