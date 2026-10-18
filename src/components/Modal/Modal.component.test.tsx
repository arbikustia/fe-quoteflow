import { fireEvent, render, screen } from "@testing-library/react";

import { ModalComponent } from "./Modal.component";

describe("ModalComponent", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Modal title",
    children: <p>Modal content</p>,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("should not render when closed", (): void => {
    render(<ModalComponent {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render title and content when open", (): void => {
    render(<ModalComponent {...defaultProps} />);

    expect(screen.getByRole("dialog")).toHaveTextContent("Modal title");
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("should close from close button and backdrop", (): void => {
    render(<ModalComponent {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    fireEvent.click(screen.getByRole("button", { name: "Close modal backdrop" }));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });
});
