import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeVariant = "primary" | "success" | "warning" | "danger" | "gray" | "black";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "badge",
        variant === "primary" && "badge-primary",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        variant === "danger" && "badge-danger",
        variant === "gray" && "badge-gray",
        variant === "black" && "badge-black",
        className
      )}
    >
      {children}
    </span>
  );
}
