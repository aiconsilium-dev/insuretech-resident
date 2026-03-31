import clsx from "clsx";

interface Props {
  variant?: "primary" | "black" | "default";
  children: React.ReactNode;
  className?: string;
}

export default function StatusPill({ variant = "default", children, className }: Props) {
  return (
    <span
      className={clsx(
        "badge",
        variant === "primary" && "badge-primary",
        variant === "black" && "badge-black",
        variant === "default" && "badge-gray",
        className
      )}
    >
      {children}
    </span>
  );
}
