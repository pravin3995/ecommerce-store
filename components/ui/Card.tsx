import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-navy/10 bg-white shadow-card ${className}`}
      {...props}
    />
  );
}
