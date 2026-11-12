import type { SelectOption } from "@/components/Select";

// Matches --animate-scan-success in src/index.css (single 1.5s fade in/out).
export const SCAN_HIGHLIGHT_DURATION_MS = 1500;

export const MOVE_CHECKBOX_CLASS = "text-lg [&_.ant-checkbox]:h-7! [&_.ant-checkbox]:w-7! [&_.ant-checkbox]:rounded-lg! [&_.ant-checkbox]:border-2! [&_.ant-checkbox]:border-text-primary! [&_.ant-checkbox::after]:h-3.5! [&_.ant-checkbox::after]:w-2! [&_.ant-checkbox::after]:border-2! [&_.ant-checkbox::after]:border-t-0! [&_.ant-checkbox::after]:border-l-0!";

export const SCAN_HIGHLIGHT_CLASS = "motion-safe:animate-scan-success motion-reduce:bg-success-subtle";

export const FOCUS_AT_OPTIONS: SelectOption[] = [
  { value: "moveOut", label: "Move Out" },
  { value: "moveIn", label: "Move In" },
];
