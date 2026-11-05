export type SwitchProps = {
  id?: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  size?: "small" | "medium";
  className?: string;
};
