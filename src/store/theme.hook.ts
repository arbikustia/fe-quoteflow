import { useAppDispatch, useAppSelector } from "./hooks";
import { selectTheme, setTheme, toggleTheme } from "./theme.slice";
import type { Theme, ThemeHook } from "./theme.type";

/**
 * Custom hook for theme management
 * Exposes current theme and toggle/set operations using typed Redux hooks
 * @returns {ThemeHook} theme state and operations
 */
export const useTheme = (): ThemeHook => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  return {
    theme,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (nextTheme: Theme) => dispatch(setTheme(nextTheme)),
  };
};