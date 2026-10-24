import * as React from "react";
import { Button } from "antd";

import {
  BUTTON_BASE_CLASS,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT_CLASS,
} from "./Button.config";
import type { ButtonProps } from "./Button.type";

/**
 * Map QuoteFlow button variant to Ant Design variant.
 * @param {ButtonProps["variant"]} variant - QuoteFlow button variant
 * @returns {"text" | "outlined" | "solid"} - Ant Design variant
 */
const _getAntdVariant = (variant: ButtonProps["variant"]): "text" | "outlined" | "solid" => {
  if (variant === "ghost" || variant === "tertiary") {
    return "text";
  }

  if (variant === "secondary") {
    return "outlined";
  }

  return "solid";
};

/**
 * Render Button Component using Ant Design.
 * @param {ButtonProps} props - button component props
 * @returns {React.ReactElement} - ButtonComponent
 */
export const ButtonComponent = (props: ButtonProps): React.ReactElement => {
  const { children, variant = "primary", size = "default", leftIcon, rightIcon,
    isLoading = false, disabled = false, type = "button", className = "", ...buttonProps } = props;
  const antdType = variant === "link" ? "link" : "primary";
  const antdVariant = _getAntdVariant(variant);
  const classNames = [BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant], BUTTON_SIZE_CLASS[size], className].join(" ").trim();

  return (
    <Button {...buttonProps} aria-busy={isLoading || undefined}
      aria-label={isLoading && typeof children === "string" ? children : buttonProps["aria-label"]}
      className={classNames} danger={variant === "danger"} disabled={disabled || isLoading}
      icon={leftIcon} loading={isLoading} size={size === "default" ? "middle" : size}
      htmlType={type} type={antdType} variant={antdVariant}>
      {children}{rightIcon}
    </Button>
  );
};

export default ButtonComponent;
