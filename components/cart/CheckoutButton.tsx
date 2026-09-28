"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout.actions";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Redirecting to payment..." : "Pay with Stripe"}
    </Button>
  );
}

export function CheckoutButton() {
  const [state, formAction] = useFormState(createCheckoutSession, undefined);

  return (
    <form action={formAction}>
      {state?.error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      <SubmitButton />
      <p className="mt-3 text-center text-xs text-navy/45">
        Test mode &middot; use card 4242 4242 4242 4242, any future date/CVC
      </p>
    </form>
  );
}
