const MORNING_START_HOUR = 5;
const AFTERNOON_START_HOUR = 12;
const EVENING_START_HOUR = 17;
const NIGHT_START_HOUR = 21;

/**
 * Get greeting for local hour.
 * @param {number} hour - Local hour from 0 through 23
 * @returns {string} Time-based greeting
 */
export const getGreeting = (hour: number): string => {
  if (hour >= MORNING_START_HOUR && hour < AFTERNOON_START_HOUR) {
    return "Good morning";
  }

  if (hour >= AFTERNOON_START_HOUR && hour < EVENING_START_HOUR) {
    return "Good afternoon";
  }

  if (hour >= EVENING_START_HOUR && hour < NIGHT_START_HOUR) {
    return "Good evening";
  }

  return "Good night";
};
