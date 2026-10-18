import * as React from "react";

import { formatRealtimeClock } from "./Navbar.helpers";

/**
 * Provide current realtime timestamp string.
 * @returns {string} Realtime clock string
 */
export const useRealtimeClock = (): string => {
  const [time, setTime] = React.useState<string>(() => formatRealtimeClock(new Date()));

  React.useEffect(() => {
    const timer = setInterval((): void => {
      setTime(formatRealtimeClock(new Date()));
    }, 1000);

    return (): void => {
      clearInterval(timer);
    };
  }, []);

  return time;
};
