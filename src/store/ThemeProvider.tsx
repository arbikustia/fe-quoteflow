import React, { useEffect } from "react";

import { useAppSelector } from "./hooks";
import { selectTheme } from "./theme.slice";

export type ThemeProviderProps = {
  readonly children: React.ReactNode;
};

/**
 * ThemeProvider synchronizes current Redux theme state with the DOM document root (.dark/.light class).
 * Both classes are set explicitly so an OS-level prefers-color-scheme: dark cannot override the user choice.
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
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
  }, [theme]);

  return <>{children}</>;
};