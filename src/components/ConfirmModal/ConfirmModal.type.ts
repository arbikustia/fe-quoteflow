import type { ReactNode, RefObject } from "react";

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: ReactNode;
  recordName?: string;
  consequence?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
};
