import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Preview from "./index";

describe("Preview Page Test", () => {
  it("should render button preview examples", (): void => {
    render(<Preview />);

    expect(screen.getByRole("button", { name: "Create quotation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeInTheDocument();
  });
});
