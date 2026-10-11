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
  errorText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
  onConfirmError?: (error: Error) => void;
};

export type ConfirmModalComponentProps = Omit<ConfirmModalProps, "isLoading" | "onConfirm" | "onConfirmError"> & {
  errorMessage: string | null;
  isBusy: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

export type ConfirmModalState = {
  errorMessage: string | null;
  isBusy: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};
