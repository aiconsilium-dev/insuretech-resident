import clsx from "clsx";
import type { ReactNode } from "react";

interface SubTabsProps {
  children: ReactNode;
  className?: string;
}

function SubTabs({ children, className }: SubTabsProps) {
  return <div className={clsx("sub-tabs", className)}>{children}</div>;
}

interface TabProps {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

function Tab({ active, children, onClick }: TabProps) {
  return (
    <button className={clsx("sub-tab", active && "active")} onClick={onClick}>
      {children}
    </button>
  );
}

SubTabs.Tab = Tab;
export default SubTabs;
