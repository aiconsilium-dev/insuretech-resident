import clsx from "clsx";
import type { ReactNode } from "react";

interface StepProps {
  label: string;
  status: "done" | "current" | "pending";
}

function Step({ label, status }: StepProps) {
  return (
    <div className={clsx("status-step", status)}>
      <div className="status-step-dot" />
      <span>{label}</span>
    </div>
  );
}

function StatusSteps({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("status-steps", className)}>{children}</div>;
}

StatusSteps.Step = Step;
export default StatusSteps;
