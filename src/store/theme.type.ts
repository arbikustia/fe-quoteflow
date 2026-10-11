export type Theme = "light" | "dark";

export type ThemeState = {
  readonly theme: Theme;
};

export type ThemeHook = {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
};

export type ThemeProviderProps = {
  readonly children: React.ReactNode;
};
