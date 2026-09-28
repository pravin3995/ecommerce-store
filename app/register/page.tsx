"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { registerAction } from "@/actions/auth.actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, undefined);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/account";

  return (
    <div className="mx-auto max-w-sm px-6 py-20 sm:px-8">
      <h1 className="text-2xl font-extrabold text-navy">Create your account</h1>
      <p className="mt-1 text-sm text-navy/55">Track orders and check out faster.</p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="returnTo" value={returnTo} />
        {state?.error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}
        <Input label="Full name" name="name" type="text" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-navy/55">
        Already have an account?{" "}
        <Link href={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
