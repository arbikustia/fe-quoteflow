import type { ReactElement } from "react";

import type { InputFieldProps } from "./InputField.type";

/**
 * Render input field component
 * @param {InputFieldProps} props - Field props
 * @returns {ReactElement} Field element
 */
export const InputField = (props: InputFieldProps): ReactElement => {
  const { label, icon, value, required, placeholder, onChange, multiline } = props;

  return (
    <div className="mb-5">
      <label className="block text-[12px] font-bold text-text-tertiary mb-2 pl-3 tracking-widest uppercase">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-4 text-text-tertiary">{icon}</div>
        {multiline ? (
          <textarea
            value={value}
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            rows={3}
            className="w-full bg-background-surface border border-border-strong rounded-2xl py-3.5 pl-12 pr-5 text-[15px] font-semibold text-text-primary shadow-xs outline-none focus:border-border-focus focus:ring-4 focus:ring-focus-ring/25 transition-all resize-none"
          />
        ) : (
          <input
            value={value}
            required={required}
            placeholder={placeholder}
            onChange={onChange}
            className="w-full bg-background-surface border border-border-strong rounded-2xl py-3.5 pl-12 pr-5 text-[15px] font-semibold text-text-primary shadow-xs outline-none focus:border-border-focus focus:ring-4 focus:ring-focus-ring/25 transition-all"
          />
        )}
      </div>
    </div>
  );
};
