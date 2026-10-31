const INDONESIAN_MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

/**
 * Format Date to Indonesian long date and 24-hour time.
 * @param {Date} date - Date instance to format
 * @returns {string} Formatted date string
 */
export const formatRealtimeClock = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${date.getDate()} ${INDONESIAN_MONTHS[date.getMonth()]} ${date.getFullYear()} ${hours}:${minutes}`;
};
