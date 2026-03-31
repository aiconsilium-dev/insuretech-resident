import clsx from "clsx";
import type { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
  className?: string;
}

function List({ children, className }: ListProps) {
  return (
    <div className={clsx("card overflow-hidden", className)}>
      {children}
    </div>
  );
}

interface ListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function ListItem({ children, className, onClick }: ListItemProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3.5 py-4 px-5 border-b border-border-subtle last:border-b-0",
        onClick && "cursor-pointer hover:bg-surface-hover",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function ListDivider() {
  return <div className="h-px bg-border-subtle mx-5" />;
}

List.Item = ListItem;
List.Divider = ListDivider;
export default List;
