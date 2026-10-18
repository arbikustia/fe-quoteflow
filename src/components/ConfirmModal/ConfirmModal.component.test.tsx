import { fireEvent, render, screen } from "@testing-library/react";

import { ConfirmModalComponent } from "./ConfirmModal.component";

describe("ConfirmModalComponent", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Confirm logout",
    message: "Are you sure you want to log out?",
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should not render when closed", (): void => {
    render(<ConfirmModalComponent {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("should render confirmation content when open", (): void => {
    render(<ConfirmModalComponent {...defaultProps} />);

    expect(screen.getByRole("alertdialog")).toHaveTextContent("Confirm logout");
    expect(screen.getByText("Are you sure you want to log out?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("should confirm and close when confirm is clicked", (): void => {
    render(<ConfirmModalComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should close when cancel or backdrop is clicked", (): void => {
    render(<ConfirmModalComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Close confirmation modal" }));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });
});
