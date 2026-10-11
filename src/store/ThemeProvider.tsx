import React, { useEffect } from "react";

import { useAppSelector } from "./hooks";
import { selectTheme } from "./theme.slice";

export type ThemeProviderProps = {
  readonly children: React.ReactNode;
};

/**
 * ThemeProvider synchronizes current Redux theme state with the DOM document root (.dark class).
 * @param {ThemeProviderProps} props - provider props
 * @returns {React.ReactElement} node
 */
export const ThemeProvider = ({ children }: ThemeProviderProps): React.ReactElement => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
};