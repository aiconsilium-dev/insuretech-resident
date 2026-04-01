import { createContext, useContext, type ReactNode } from "react";
import clsx from "clsx";

interface CardContextValue {
  variant?: "default" | "outlined" | "elevated" | "accent" | "info";
}

const CardContext = createContext<CardContextValue>({});

interface CardProps {
  children: ReactNode;
  variant?: "default" | "outlined" | "elevated" | "accent" | "info";
  className?: string;
  onClick?: () => void;
}

function Card({ children, variant = "default", className, onClick }: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={clsx(
          "card",
          variant === "outlined" && "border border-border shadow-none",
          variant === "elevated" && "shadow-md",
          variant === "accent" && "border-l-4 border-l-[#00854A] border border-border shadow-none",
          variant === "info" && "border-l-4 border-l-[#0061AF] border border-border shadow-none",
          onClick && "cursor-pointer active:scale-[0.98] transition-transform",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-4 pt-4 pb-2", className)}>
      {children}
    </div>
  );
}

function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-4 py-2", className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-4 pt-2 pb-4 border-t border-border-subtle", className)}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
