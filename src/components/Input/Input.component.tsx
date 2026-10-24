import type { ReactElement } from "react";
import { Input, InputNumber, Select } from "antd";

import type { InputComponentProps, SelectInputProps } from "./Input.type";

/**
 * Render Ant Design select primitive.
 * @param {SelectInputProps} props - Select props
 * @returns {ReactElement} Select control
 */
const _renderSelect = (props: SelectInputProps): ReactElement => {
  const { id, label, value, placeholder, required, disabled, readOnly, errorMessage, options, onChange } = props;

  return (
    <Select<string>
      id={id}
      aria-label={label}
      aria-required={required}
      aria-invalid={Boolean(errorMessage)}
      aria-describedby={errorMessage ? `${id}-error` : undefined}
      value={value === "" ? undefined : value}
      placeholder={placeholder}
      disabled={disabled || readOnly}
      options={[...options]}
      onChange={onChange}
      size="large"
      status={errorMessage ? "error" : undefined}
      className="h-14 w-full"
      virtual={false}
    />
  );
};

/**
 * Render the input primitive selected by its type.
 * @param {InputComponentProps} props - Controlled input props
 * @returns {ReactElement} Ant Design control
 */
const _renderControl = (props: InputComponentProps): ReactElement => {
  if (props.type === "select") {
    return _renderSelect(props);
  }

  const { id, placeholder, required, disabled, readOnly, errorMessage } = props;
  const sharedProps = {
    id, placeholder, required, disabled, readOnly,
    "aria-invalid": Boolean(errorMessage),
    "aria-describedby": errorMessage ? `${id}-error` : undefined,
  };

  if (props.type === "number") {
    return <InputNumber {...sharedProps} size="large" value={props.value}
      min={props.min} max={props.max} step={props.step} onChange={props.onChange}
      status={errorMessage ? "error" : undefined} className="h-14 w-full" />;
  }

  if (props.type === "textarea") {
    return <Input.TextArea {...sharedProps} size="large" value={props.value}
      rows={props.rows ?? 3} onChange={props.onChange} status={errorMessage ? "error" : undefined} />;
  }

  return <Input {...sharedProps} size="large" type={props.type ?? "text"} value={props.value}
    inputMode={props.inputMode} pattern={props.pattern} title={props.title}
    onChange={props.onChange} status={errorMessage ? "error" : undefined} className="h-14 w-full" />;
};

/**
 * Render validation or required guidance text.
 * @param {string} id - Input ID
 * @param {string | null | undefined} errorMessage - Validation message
 * @returns {ReactElement | null} Guidance element
 */
const _renderGuidance = (id: string, errorMessage: string | null | undefined): ReactElement | null => {
  if (errorMessage) {
    return <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-danger">{errorMessage}</p>;
  }

  return null;
};

/**
 * Render a labelled reusable Ant Design form control.
 * @param {InputComponentProps} props - Controlled input props
 * @returns {ReactElement} Form field
 */
export const InputComponent = (props: InputComponentProps): ReactElement => {
  const { id, label, required, errorMessage, className = "" } = props;
  const guidance = _renderGuidance(id, errorMessage);

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      {_renderControl(props)}
      {guidance}
    </div>
  );
};
