import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ButtonComponent } from "./Button.component";

describe("ButtonComponent", () => {
  it("should render create action as primary button", (): void => {
    render(<ButtonComponent variant="primary">Create quotation</ButtonComponent>);

    const button = screen.getByRole("button", { name: "Create quotation" });

    expect(button).toHaveClass("bg-action-primary");
    expect(button).toHaveAttribute("type", "button");
  });

  it("should render download action as secondary button", (): void => {
    render(<ButtonComponent variant="secondary">Download PDF</ButtonComponent>);

    const button = screen.getByRole("button", { name: "Download PDF" });

    expect(button).toHaveClass("border-border-strong");
    expect(button).not.toHaveClass("bg-action-primary");
  });

  it("should not invoke action while loading", (): void => {
    const onClick = vi.fn();

    render(
      <ButtonComponent isLoading={true} onClick={onClick}>
        Create quotation
      </ButtonComponent>,
    );

    const button = screen.getByRole("button", { name: "Create quotation" });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });
});
