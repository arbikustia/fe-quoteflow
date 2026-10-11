import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Modal from "./Modal.container";

describe("Modal Snapshot", () => {
  it("should render accessible modal", (): void => {
    const { asFragment } = render(<Modal isOpen={true} onClose={vi.fn()} title="Edit customer"><button type="button">Save</button></Modal>);

    expect(asFragment()).toMatchSnapshot();
  });
});
