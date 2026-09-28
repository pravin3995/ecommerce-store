"use client";

import { useRef, useState, useTransition } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/actions/cart.actions";
import { Button } from "@/components/ui/Button";

type Props = {
  productId: string;
  returnTo: string;
  disabled?: boolean;
  quantity?: number;
  compact?: boolean;
};

export function AddToCartButton({ productId, returnTo, disabled, quantity = 1, compact }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await addToCartAction(formData);
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1600);
        });
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <Button
        type="submit"
        size={compact ? "icon" : "md"}
        disabled={disabled || isPending}
        aria-label={compact ? (disabled ? "Out of stock" : "Add to cart") : undefined}
      >
        {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
        {compact ? "" : disabled ? "Out of stock" : justAdded ? "Added" : isPending ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}
