export type Theme = "light" | "dark";

export type ThemeState = {
  theme: Theme;
};

export type ThemeHook = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export type ThemeProviderProps = {
  children: React.ReactNode;
};
