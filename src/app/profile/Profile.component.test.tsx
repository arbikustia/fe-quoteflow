import { fireEvent, render, screen } from "@testing-library/react";

import { ProfileComponent } from "./Profile.component";
import type { ProfileProps } from "./Profile.type";

jest.mock("../../components/ConfirmModal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div role="alertdialog">Confirm logout</div> : null,
}));

const defaultProps: ProfileProps = {
  username: "alice",
  theme: "light",
  isLogoutConfirmOpen: false,
  onToggleTheme: jest.fn(),
  onOpenLogoutConfirm: jest.fn(),
  onCloseLogoutConfirm: jest.fn(),
  onConfirmLogout: jest.fn(),
};

describe("ProfileComponent", () => {
  it("should show login identity and switch theme", (): void => {
    const onToggleTheme = jest.fn();
    render(<ProfileComponent {...defaultProps} onToggleTheme={onToggleTheme} />);

    expect(screen.getByText("alice")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Theme mode: light/ }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("should show unavailable identity and request logout confirmation", (): void => {
    const onOpenLogoutConfirm = jest.fn();
    render(<ProfileComponent {...defaultProps} username={null} onOpenLogoutConfirm={onOpenLogoutConfirm} />);

    expect(screen.getByText("Username unavailable")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(onOpenLogoutConfirm).toHaveBeenCalledTimes(1);
  });
});
