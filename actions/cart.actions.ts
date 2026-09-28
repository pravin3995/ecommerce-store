"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { addItemToCart, updateCartItemQuantity, removeCartItem } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const user = await getCurrentUser();
  const productId = String(formData.get("productId") ?? "");
  const returnTo = formData.get("returnTo");

  if (!user) {
    const target = typeof returnTo === "string" && returnTo.startsWith("/") ? returnTo : "/";
    redirect(`/login?returnTo=${encodeURIComponent(target)}`);
  }

  if (!productId) return;

  const quantity = Number(formData.get("quantity") ?? 1) || 1;
  await addItemToCart(user.id, productId, quantity);
  revalidatePath("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const productId = String(formData.get("productId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  if (!productId) return;

  await updateCartItemQuantity(user.id, productId, quantity);
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  await removeCartItem(user.id, productId);
  revalidatePath("/cart");
}
