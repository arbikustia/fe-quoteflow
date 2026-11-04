import type { ReactNode } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  titleClassName?: string;
  children: ReactNode;
  maxWidth?: string;
  contentClassName?: string;
  dialogClassName?: string;
};
