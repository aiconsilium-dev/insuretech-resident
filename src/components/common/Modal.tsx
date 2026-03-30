import type { ReactNode } from "react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  center?: boolean;
}

function Modal({ open, onClose, children, center }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={clsx(
        "modal-backdrop",
        center && "!items-center"
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          center
            ? "bg-white rounded-[var(--radius-card)] w-[calc(100%-40px)] max-w-[380px] max-h-[80vh] overflow-y-auto"
            : "modal-content"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-6 pt-6 pb-2", className)}>
      {children}
    </div>
  );
}

function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-6 py-3", className)}>
      {children}
    </div>
  );
}

function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("px-6 pt-2 pb-6", className)}>
      {children}
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
