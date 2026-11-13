import type { SkeletonColumn } from "@/components/Skeleton";

export const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export const EMPTY_SEARCH_TEXT = "No items matching search.";

export const EMPTY_ORDER_TEXT = "No items found for this order.";

export const ITEMS_SKELETON_ROWS = 5;

export const ITEMS_SKELETON_COLUMNS: SkeletonColumn[] = [
  { width: "30%" },
  { width: "20%" },
  { width: "10%" },
  { width: "15%" },
  { width: "15%" },
  { width: "10%" },
];

export const CAPTURE_LABEL_CLASS = "relative inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-border-default bg-background-surface px-5 py-2.5 text-lg font-medium text-text-primary hover:bg-background-subtle focus-within:ring-2 focus-within:ring-focus-ring";

export const CAPTURE_INPUT_CLASS = "absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed";

export const REMARK_TEXTAREA_CLASS = "mt-2 min-h-24 w-full resize-y rounded-2xl border border-border-strong bg-background-surface px-4 py-3 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50";

export const REMARK_INPUT_CLASS = "h-12 w-full rounded-2xl border border-border-strong bg-background-surface px-4 text-lg text-text-primary placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:opacity-50";

export const REMOVE_PHOTO_CLASS = "absolute -right-2 -top-2 h-6 w-6 rounded-full bg-danger text-sm font-bold text-text-inverse disabled:opacity-50";

export const CANCEL_BUTTON_CLASS = "h-14 cursor-pointer rounded-xl border border-border-default bg-background-surface px-8 text-lg font-semibold text-text-primary transition-colors hover:bg-background-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-50";

export const SAVE_BUTTON_CLASS = "h-14 cursor-pointer rounded-xl bg-action-primary px-8 text-lg font-semibold text-text-inverse shadow-xs transition-colors hover:bg-action-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary disabled:cursor-not-allowed disabled:opacity-60";

export const NOTES_TEXTAREA_CLASS = "min-h-24 w-full resize-y rounded-2xl border-2 border-border-strong bg-background-surface px-4 py-3 text-xl text-text-primary placeholder:text-xl placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring md:hidden";

export const NOTES_INPUT_CLASS = "hidden h-14 w-full rounded-2xl border-2 border-border-strong bg-background-surface px-4 text-lg text-text-primary placeholder:text-lg placeholder:text-text-placeholder focus:border-action-primary focus:outline-none focus:ring-2 focus:ring-focus-ring md:block";

export const DISCARD_BUTTON_CLASS = "min-h-12 rounded-2xl border border-border-default px-6 text-lg font-medium text-text-primary hover:bg-background-subtle disabled:opacity-50";

export const CONFIRM_BUTTON_CLASS = "min-h-12 rounded-2xl bg-action-primary px-6 text-lg font-semibold text-text-inverse hover:bg-action-primary-hover disabled:opacity-50";
