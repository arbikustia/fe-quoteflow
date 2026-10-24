import type { ReactElement } from "react";
import { Select as AntSelect } from "antd";

import type { SelectOption, SelectProps } from "./Select.type";

/**
 * Build visible Ant Design options.
 * @param {readonly SelectOption[]} options - Select options
 * @returns {SelectOption[]} Visible options
 */
const _getOptions = (options: readonly SelectOption[]): SelectOption[] => options.filter((option) => option.value !== "" && option.label.trim() !== "");

/**
 * Render reusable Ant Design select field.
 * @param {SelectProps} props - Select field props
 * @returns {ReactElement} Select component
 */
export const Select = (props: SelectProps): ReactElement => {
  const { id, label, placeholder, value, options, onChange, required, disabled, errorMessage, className = "", labelClassName = "", popupClassName = "" } = props;
  const errorId = `${id}-error`;

  /**
   * Handle Ant Design selection.
   * @param {string} selectedValue - Selected option value
   * @returns {void} No return value
   */
  const handleChange = (selectedValue: string): void => onChange(selectedValue);

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className={`mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary ${labelClassName}`}>
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      <AntSelect<string>
        id={id}
        aria-label={label}
        aria-required={required}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        value={value}
        options={_getOptions(options)}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        status={errorMessage ? "error" : undefined}
        className="h-14 w-full"
        classNames={{ popup: { root: popupClassName } }}
        virtual={false}
      />
      {errorMessage && <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-medium text-danger">{errorMessage}</p>}
    </div>
  );
};
