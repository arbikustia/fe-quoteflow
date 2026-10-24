import type { ReactElement } from "react";
import { Switch as AntSwitch } from "antd";

import type { SwitchProps } from "./Switch.type";

/**
 * Render reusable Ant Design switch.
 * @param {SwitchProps} props - Switch state and behavior
 * @returns {ReactElement} Switch control
 */
export const SwitchComponent = ({ id, label, checked, onChange, disabled = false, loading = false, size = "default", className = "" }: SwitchProps): ReactElement => (
  <AntSwitch
    id={id}
    aria-label={label}
    checked={checked}
    className={className}
    disabled={disabled}
    loading={loading}
    onChange={onChange}
    size={size}
  />
);

export default SwitchComponent;
