"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-fetches the (server-rendered) success page a few times while the
// Stripe webhook is still in flight, so "Confirming your payment..." turns
// into "Payment received" without the user needing to hit refresh manually.
export function PendingOrderRefresher() {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      router.refresh();
      if (attempts >= 5) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
