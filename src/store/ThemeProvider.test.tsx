import { configureStore } from "@reduxjs/toolkit";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import { themeSlice } from "./theme.slice";
import { ThemeProvider } from "./ThemeProvider";
import type { Theme } from "./theme.type";

const renderThemeProvider = (theme: Theme): void => {
  const store = configureStore({
    reducer: { theme: themeSlice.reducer },
    preloadedState: { theme: { theme } },
  });

  render(
    <Provider store={store}>
      <ThemeProvider>
        <div />
      </ThemeProvider>
    </Provider>,
  );
};

afterEach(() => {
  document.documentElement.classList.remove("dark", "light");
});

describe("ThemeProvider", () => {
  it("should apply light class when theme is light", async () => {
    renderThemeProvider("light");

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("light");
      expect(document.documentElement).not.toHaveClass("dark");
    });
  });

  it("should apply dark class when theme is dark", async () => {
    renderThemeProvider("dark");

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement).not.toHaveClass("light");
    });
  });
});
