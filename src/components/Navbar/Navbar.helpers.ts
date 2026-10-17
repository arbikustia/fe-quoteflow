/**
 * Format a Date object to DD-MM-YYYY HH:mm:ss string.
 * @param {Date} date - Date instance to format
 * @returns {string} Formatted date string
 */
export const formatRealtimeClock = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear().toString();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
