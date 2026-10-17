import type { ReactElement } from "react";

import type { InputFieldProps } from "./InputField.type";

/**
 * Render input field component
 * @param {InputFieldProps} props - Field props
 * @returns {ReactElement} Field element
 */
export const InputField = (props: InputFieldProps): ReactElement => {
  const { label, placeholder, value, required, onChange } = props;

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-red-600">*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border border-border-default bg-background-surface px-4 py-3 text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all placeholder:font-normal placeholder:text-text-tertiary/60 focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30"
      />
    </div>
  );
};
