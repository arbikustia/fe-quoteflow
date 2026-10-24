import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger" | "ghost" | "link";

export type ButtonSize = "small" | "default" | "large";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "color"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  className?: string;
};
