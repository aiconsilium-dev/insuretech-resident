import clsx from "clsx";
import type { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

function Form({ children, className, onSubmit }: FormProps) {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
}

function FormField({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mb-5", className)}>{children}</div>;
}

function FormLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <label className={clsx("block text-sm font-semibold text-black mb-2", className)}>
      {children}
    </label>
  );
}

function FormInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={clsx("input", className)}
      {...props}
    />
  );
}

function FormError({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("text-xs text-danger mt-1.5", className)}>
      {children}
    </div>
  );
}

Form.Field = FormField;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Error = FormError;
export default Form;
