import * as React from "react";

import {
  BUTTON_BASE_CLASS,
  BUTTON_ICON_CLASS,
  BUTTON_LOADING_CLASS,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT_CLASS,
} from "./Button.config";
import type { ButtonProps } from "./Button.type";

/**
 * Render class name
 * @param {ButtonProps} props - button component props
 * @returns {string} - class name
 */
const _getButtonClassName = (props: ButtonProps): string => {
  const { variant = "primary", size = "default", className = "" } = props;

  return [BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS[variant], BUTTON_SIZE_CLASS[size], className].join(" ").trim();
};

/**
 * Render icon wrapper
 * @param {React.ReactNode} icon - icon node
 * @returns {React.ReactElement | null} - icon wrapper
 */
const _renderIcon = (icon?: React.ReactNode): React.ReactElement | null => {
  if (!icon) {
    return null;
  }

  return <span className={BUTTON_ICON_CLASS}>{icon}</span>;
};

/**
 * Render loading spinner
 * @returns {React.ReactElement} - loading spinner
 */
const _renderLoading = (): React.ReactElement => <span aria-hidden="true" className={BUTTON_LOADING_CLASS} />;

/**
 * Render Button Component
 * @param {ButtonProps} props - button component props
 * @returns {React.ReactElement} - ButtonComponent
 */
export const ButtonComponent = (props: ButtonProps): React.ReactElement => {
  const {
    children,
    variant = "primary",
    size = "default",
    leftIcon,
    rightIcon,
    isLoading = false,
    disabled = false,
    type = "button",
    className = "",
    ...buttonProps
  } = props;
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...buttonProps}
      aria-busy={isLoading || undefined}
      className={_getButtonClassName({ children, variant, size, className })}
      disabled={isDisabled}
      type={type}
    >
      <span className={isLoading ? "invisible inline-flex items-center gap-2" : "inline-flex items-center gap-2"}>
        {_renderIcon(leftIcon)}
        <span>{children}</span>
        {_renderIcon(rightIcon)}
      </span>
      {isLoading && <span className="absolute" aria-hidden="true">{_renderLoading()}</span>}
    </button>
  );
};
