const MONTH_NAMES = ["jan", "feb", "mar", "apr", "mei", "jun", "jul", "agu", "sep", "okt", "nov", "des"];

/**
 * Format activity creation timestamp.
 * @param {string} createdAt - Activity creation timestamp
 * @returns {string} Formatted timestamp
 */
export const formatActivityDateTime = (createdAt: string): string => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return createdAt;

  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

/**
 * Get action badge styling.
 * @param {string} action - Activity action
 * @returns {string} Action badge classes
 */
export const getActionBadgeClass = (action: string): string => {
  const normalizedAction = action.toLowerCase();

  if (normalizedAction.includes("delete") || normalizedAction.includes("hapus")) {
    return "bg-danger-subtle text-danger-strong";
  }

  if (normalizedAction.includes("create") || normalizedAction.includes("add") || normalizedAction.includes("buat")) {
    return "bg-success-subtle text-success-strong";
  }

  if (normalizedAction.includes("update") || normalizedAction.includes("edit") || normalizedAction.includes("ubah")) {
    return "bg-warning-subtle text-warning-strong";
  }

  return "bg-information-subtle text-information-strong";
};
