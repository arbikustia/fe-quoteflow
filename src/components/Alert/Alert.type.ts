import type { ReactNode } from "react";

export type AlertType = "success" | "info" | "warning" | "error";

export type AlertToastState = {
  isVisible: boolean;
  closeToast: () => void;
};

export type AlertProps = {
  type?: AlertType;
  message: ReactNode;
  description?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  toast?: boolean;
};
