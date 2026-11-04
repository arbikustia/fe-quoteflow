const INDONESIAN_MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/**
 * Format date using Indonesian month and 24-hour time.
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatIndonesianDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return `${String(date.getDate()).padStart(2, "0")} ${INDONESIAN_MONTHS[date.getMonth()]} ${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
