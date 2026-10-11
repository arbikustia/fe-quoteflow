import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonComponent } from "./Button.component";

describe("ButtonComponent Snapshot", () => {
  it("should render primary create button", (): void => {
    const { asFragment } = render(<ButtonComponent variant="primary">Create quotation</ButtonComponent>);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should render secondary download button", (): void => {
    const { asFragment } = render(<ButtonComponent variant="secondary">Download PDF</ButtonComponent>);

    expect(asFragment()).toMatchSnapshot();
  });
});
