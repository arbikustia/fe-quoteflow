import { render } from "@testing-library/react";

import { ConfirmModalComponent } from "./ConfirmModal.component";

describe("ConfirmModalComponent snapshots", () => {
  it("should match open destructive modal snapshot", (): void => {
    const { asFragment } = render(
      <ConfirmModalComponent
        isOpen={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Confirm logout"
        message="Are you sure you want to log out?"
      />,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
