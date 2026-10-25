import { ConfigProvider, theme as antdTheme } from "antd";
import enUS from "antd/locale/en_US";
import React, { useEffect } from "react";

import { useAppSelector } from "./hooks";
import { selectTheme } from "./theme.slice";

export type ThemeProviderProps = {
  children: React.ReactNode;
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

  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme === "dark" ? "#7188FA" : "#3550D7",
          colorBgContainer: "var(--background-surface)",
          colorBgElevated: "var(--background-elevated)",
          colorBgLayout: "var(--background-page)",
          colorText: "var(--text-primary)",
          colorTextSecondary: "var(--text-secondary)",
          colorBorder: "var(--border-default)",
          fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
          borderRadius: 8,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};