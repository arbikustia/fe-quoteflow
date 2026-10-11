import type { KeyboardEvent as ReactKeyboardEvent, ReactNode, RefObject } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  isCloseDisabled?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
};

export type ModalComponentProps = ModalProps & {
  dialogRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  handleDialogKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
};

export type ModalAccessibility = {
  dialogRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  handleDialogKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
};
