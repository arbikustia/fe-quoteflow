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
    expect(screen.getByRole("heading", { name: "Account information" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Preferences" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Session" })).toBeInTheDocument();
    expect(screen.getByLabelText("Profile content")).toHaveClass("lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.6fr)]");
  });

  it("should show unavailable identity and request logout confirmation", (): void => {
    const onOpenLogoutConfirm = jest.fn();
    render(<ProfileComponent {...defaultProps} username={null} onOpenLogoutConfirm={onOpenLogoutConfirm} />);

    expect(screen.getByText("Username unavailable")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(onOpenLogoutConfirm).toHaveBeenCalledTimes(1);
  });
});
