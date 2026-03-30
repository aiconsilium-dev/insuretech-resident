import clsx from "clsx";
import type { ReactNode } from "react";

interface TabBarProps {
  children: ReactNode;
  className?: string;
}

function TabBar({ children, className }: TabBarProps) {
  return <div className={clsx("tab-bar", className)}>{children}</div>;
}

interface TabBarItemProps {
  active?: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

function TabBarItem({ active, icon, label, onClick }: TabBarItemProps) {
  return (
    <button className={clsx("tab-item", active && "active")} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

TabBar.Item = TabBarItem;
export default TabBar;
