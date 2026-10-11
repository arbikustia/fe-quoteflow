import type { ButtonSize, ButtonVariant } from "./Button.type";

export const BUTTON_BASE_CLASS = "relative inline-flex items-center justify-center gap-2 rounded-medium border text-sm font-medium transition-colors duration-normal motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-60";

export const BUTTON_VARIANT_CLASS: { [key in ButtonVariant]: string } = {
  primary: "border-action-primary bg-action-primary text-text-inverse hover:bg-action-primary-hover active:bg-action-primary-pressed",
  secondary: "border-border-strong bg-background-surface text-text-primary hover:bg-background-subtle active:bg-background-disabled",
  tertiary: "border-transparent bg-background-subtle text-text-primary hover:bg-background-disabled active:bg-background-disabled",
  danger: "border-danger bg-danger text-text-inverse hover:bg-danger-strong active:bg-danger-strong",
  ghost: "border-transparent bg-transparent text-text-primary hover:bg-background-subtle active:bg-background-disabled",
  link: "h-auto border-transparent bg-transparent p-0 text-action-primary hover:text-action-primary-hover active:text-action-primary-pressed",
};

export const BUTTON_SIZE_CLASS: { [key in ButtonSize]: string } = {
  small: "h-8 px-3 py-1.5",
  default: "h-10 px-4 py-2",
  large: "h-12 px-5 py-3",
};

export const BUTTON_ICON_CLASS = "h-4 w-4 shrink-0";

export const BUTTON_LOADING_CLASS = "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent";
