import type { ReactNode } from "react";

export type AlertType = "success" | "info" | "warning" | "error";

export type AlertProps = {
  readonly type?: AlertType;
  readonly message: ReactNode;
  readonly description?: ReactNode;
  readonly closable?: boolean;
  readonly onClose?: () => void;
  readonly className?: string;
};
