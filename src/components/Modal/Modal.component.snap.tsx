import { render } from "@testing-library/react";

import { ModalComponent } from "./Modal.component";

describe("ModalComponent snapshots", () => {
  it("should match open modal snapshot", (): void => {
    const { asFragment } = render(
      <ModalComponent isOpen={true} onClose={jest.fn()} title="Modal title">
        <p>Modal content</p>
      </ModalComponent>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
