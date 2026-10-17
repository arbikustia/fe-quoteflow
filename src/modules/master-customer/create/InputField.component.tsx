import type { ReactElement } from "react";

import type { InputFieldProps } from "./InputField.type";

/**
 * Render a labelled form field.
 * @param {InputFieldProps} props - Field props
 * @returns {ReactElement} Field element
 */
export const InputField = (props: InputFieldProps): ReactElement => {
  const { label, placeholder, value, required, type = "text", pattern, inputMode, title, multiline, onChange } = props;
  const fieldClass = "w-full bg-background-surface border border-border-default rounded-xl py-3 px-4 text-[15px] font-normal text-text-primary shadow-xs outline-none focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 transition-all placeholder:text-text-tertiary/60 placeholder:font-normal";

  return (
    <div className="mb-4">
      <label className="block text-[12px] font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      {multiline ? (
        <textarea placeholder={placeholder} value={value} required={required} onChange={onChange} rows={3} className={`${fieldClass} resize-none`} />
      ) : (
        <input type={type} placeholder={placeholder} value={value} required={required} pattern={pattern} inputMode={inputMode} title={title} onChange={onChange} className={fieldClass} />
      )}
    </div>
  );
};
