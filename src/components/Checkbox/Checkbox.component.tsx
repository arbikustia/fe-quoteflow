import type { ReactElement } from "react";
import { Checkbox as AntCheckbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

import type { CheckboxProps } from "./Checkbox.type";

/**
 * Render reusable Ant Design checkbox.
 * @param {CheckboxProps} props - Checkbox state and behavior
 * @returns {ReactElement} Checkbox control
 */
export const CheckboxComponent = (props: CheckboxProps): ReactElement => {
  const { id, label, ariaLabel, checked, onChange, disabled = false, indeterminate = false, className = "" } = props;

  /**
   * Handle Ant Design checkbox change.
   * @param {CheckboxChangeEvent} event - Checkbox change event
   * @returns {void} No return value
   */
  const handleChange = (event: CheckboxChangeEvent): void => onChange(event.target.checked);

  return (
    <AntCheckbox
      id={id}
      aria-label={ariaLabel}
      checked={checked}
      className={className}
      disabled={disabled}
      indeterminate={indeterminate}
      onChange={handleChange}
    >
      {label}
    </AntCheckbox>
  );
};

export default CheckboxComponent;
