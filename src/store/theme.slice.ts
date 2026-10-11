import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Theme, ThemeState } from "./theme.type";

const STORAGE_KEY = "quoteflow.theme";

export const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // localStorage unavailable or corrupted — fall back to light
  }

  return "light";
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>): void => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, action.payload);
        } catch {
          // ignore persistence failures
        }
      }
    },
    toggleTheme: (state): void => {
      const next = state.theme === "light" ? "dark" : "light";
      state.theme = next;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // ignore persistence failures
        }
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export const selectTheme = (state: { readonly theme: ThemeState }): Theme =>
  state.theme.theme;

export { themeSlice };

export default themeSlice.reducer;