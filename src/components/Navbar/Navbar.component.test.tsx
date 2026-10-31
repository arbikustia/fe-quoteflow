import { fireEvent, render, screen } from "@testing-library/react";

import { NavbarComponent } from "./Navbar.component";

describe("NavbarComponent", () => {
  it("should render search and current time", (): void => {
    render(<NavbarComponent isSidebarCollapsed={false} onToggleSidebar={jest.fn()} currentTime="17-10-2026 08:05:09" />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-realtime-clock")).toHaveTextContent("17-10-2026 08:05:09");
    expect(screen.getByRole("button", { name: "Close sidebar" })).toHaveAttribute("aria-expanded", "true");
  });

  it("should toggle sidebar with correct accessible state", (): void => {
    const onToggleSidebar = jest.fn();
    const { rerender } = render(<NavbarComponent isSidebarCollapsed={false} onToggleSidebar={onToggleSidebar} />);

    fireEvent.click(screen.getByRole("button", { name: "Close sidebar" }));
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);

    rerender(<NavbarComponent isSidebarCollapsed={true} onToggleSidebar={onToggleSidebar} />);
    expect(screen.getByRole("button", { name: "Open sidebar" })).toHaveAttribute("aria-expanded", "false");
  });
});
