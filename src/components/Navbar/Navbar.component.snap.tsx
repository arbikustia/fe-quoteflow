import { render } from "@testing-library/react";

import { NavbarComponent } from "./Navbar.component";

describe("NavbarComponent snapshots", () => {
  it("should match expanded sidebar snapshot", (): void => {
    const { asFragment } = render(<NavbarComponent isSidebarCollapsed={false} onToggleSidebar={jest.fn()} currentTime="17-10-2026 08:05:09" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
