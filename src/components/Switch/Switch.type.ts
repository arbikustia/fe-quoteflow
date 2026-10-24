export type SwitchProps = {
  readonly id?: string;
  readonly label?: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly size?: "small" | "default";
  readonly className?: string;
};
