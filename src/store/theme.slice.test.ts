/** @jest-environment node */

import { themeSlice, getInitialTheme, selectTheme } from "./theme.slice";
import type { ThemeState } from "./theme.type";

describe("theme slice", () => {
  describe("getInitialTheme", () => {
    it("should return light when window is undefined", () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - delete window for test
      delete globalThis.window;

      expect(getInitialTheme()).toBe("light");

      globalThis.window = originalWindow;
    });

    it("should return light when localStorage is unavailable", () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - mock window without localStorage
      globalThis.window = {};

      expect(getInitialTheme()).toBe("light");

      globalThis.window = originalWindow;
    });

    it("should return light when localStorage throws", () => {
      const originalWindow = globalThis.window;
      globalThis.window = {
        localStorage: {
          getItem: () => {
            throw new Error("Storage unavailable");
          },
        },
      } as unknown as Window & typeof globalThis;

      expect(getInitialTheme()).toBe("light");

      globalThis.window = originalWindow;
    });

    it("should return light when stored value is invalid", () => {
      const originalWindow = globalThis.window;
      globalThis.window = {
        localStorage: {
          getItem: () => "invalid",
        },
      } as unknown as Window & typeof globalThis;

      expect(getInitialTheme()).toBe("light");

      globalThis.window = originalWindow;
    });

    it("should return stored theme when valid", () => {
      const originalWindow = globalThis.window;
      const mockLocalStorage = {
        getItem: jest.fn().mockReturnValue("dark"),
      };
      globalThis.window = {
        localStorage: mockLocalStorage,
      } as unknown as Window & typeof globalThis;

      expect(getInitialTheme()).toBe("dark");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("quoteflow.theme");

      globalThis.window = originalWindow;
    });
  });

  describe("reducer", () => {
    const initialState: ThemeState = { theme: "light" };

    it("should set theme via setTheme", () => {
      const action = { type: "theme/setTheme", payload: "dark" as const };
      const state = themeSlice.reducer(initialState, action);
      expect(state.theme).toBe("dark");
    });

    it("should toggle theme via toggleTheme", () => {
      let state = themeSlice.reducer(initialState, { type: "theme/toggleTheme" });
      expect(state.theme).toBe("dark");

      state = themeSlice.reducer(state, { type: "theme/toggleTheme" });
      expect(state.theme).toBe("light");
    });
  });

  describe("selectTheme", () => {
    it("should select theme from state", () => {
      const state = { theme: { theme: "dark" as const } };
      expect(selectTheme(state)).toBe("dark");
    });
  });
});