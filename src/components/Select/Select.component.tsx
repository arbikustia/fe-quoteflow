import type { ReactElement } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

import { useSelect } from "./Select.hook";
import type { SelectOption, SelectProps } from "./Select.type";

/**
 * Render select option.
 * @param {SelectOption} option - Option data
 * @param {boolean} isSelected - Whether option is selected
 * @param {() => void} onSelect - Option selection handler
 * @returns {ReactElement} Option element
 */
const _renderOption = (option: SelectOption, isSelected: boolean, onSelect: () => void): ReactElement => (
  <li
    key={option.value}
    role="option"
    aria-selected={isSelected}
    onClick={onSelect}
    className={`flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors ${isSelected ? "bg-action-primary-subtle font-semibold text-action-primary" : "text-text-primary hover:bg-background-subtle"}`}
  >
    <span>{option.label}</span>
    {isSelected && <FiCheck className="h-4 w-4 text-action-primary" />}
  </li>
);

/**
 * Render select option list.
 * @param {SelectProps} props - Select props
 * @param {() => void} onClear - Clear selection handler
 * @param {(value: string) => () => void} getOptionHandler - Option handler factory
 * @returns {ReactElement} Option list
 */
const _renderOptions = (props: SelectProps, onClear: () => void, getOptionHandler: (value: string) => () => void): ReactElement => {
  const { id, label, options, placeholder, value } = props;
  const visibleOptions = options.filter((option) => option.value !== "" && option.label.trim() !== "");

  return (
    <ul id={`${id}-listbox`} role="listbox" aria-label={label} className="absolute left-0 right-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-border-default bg-background-surface p-1 shadow-medium">
      <li role="option" aria-selected={value === ""} onClick={onClear} className={`flex min-h-10 cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors ${value === "" ? "bg-background-subtle font-medium text-text-secondary" : "text-text-tertiary hover:bg-background-subtle"}`}>
        <span>{placeholder}</span>
        {value === "" && <FiCheck className="h-4 w-4 text-text-tertiary" />}
      </li>
      {visibleOptions.map((option) => _renderOption(option, option.value === value, getOptionHandler(option.value)))}
    </ul>
  );
};

/**
 * Render select field.
 * @param {SelectProps} props - Select field props
 * @returns {ReactElement} Select component
 */
export const Select = (props: SelectProps): ReactElement => {
  const { id, label, placeholder, value, options, onChange, required, disabled, errorMessage, className = "" } = props;
  const { isOpen, rootRef, toggleOpen, getOptionHandler } = useSelect(onChange);
  const selectedOption = options.find((option) => option.value === value);
  const errorId = `${id}-error`;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">
        {label}
        {required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
      </label>
      <button id={id} type="button" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls={`${id}-listbox`} aria-describedby={errorMessage ? errorId : undefined} disabled={disabled} onClick={toggleOpen} className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border-default bg-background-surface px-4 py-3 text-left text-[15px] font-normal text-text-primary shadow-xs outline-none transition-all hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled">
        <span className={selectedOption ? "text-text-primary" : "text-text-tertiary/60"}>{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown className={`h-5 w-5 text-text-tertiary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && _renderOptions(props, getOptionHandler(""), getOptionHandler)}
      {errorMessage && <p id={errorId} role="alert" className="mt-1.5 text-[13px] font-medium text-danger">{errorMessage}</p>}
    </div>
  );
};
