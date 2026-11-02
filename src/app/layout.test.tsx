import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Layout from "./layout";

jest.mock("../components/MobileNavigate", () => ({
  __esModule: true,
  default: (): React.ReactElement => <nav aria-label="Mobile navigation" />,
}));
jest.mock("../components/Navbar/index", () => ({
  __esModule: true,
  default: (): React.ReactElement => <div />,
}));
jest.mock("../components/Sidebar/index", () => ({
  __esModule: true,
  default: (): React.ReactElement => <div />,
}));
jest.mock("../hooks/useSidebarCollapse", () => ({
  useSidebarCollapse: (): { isSidebarCollapsed: boolean; onToggleSidebarCollapsed: () => void } => ({ isSidebarCollapsed: false, onToggleSidebarCollapsed: jest.fn() }),
}));

describe("Layout mobile navigation", () => {
  it("should show navigation and reserve bottom space on note list", (): void => {
    render(<MemoryRouter initialEntries={["/note"]}><Routes><Route path="/note" element={<Layout><p>Notes</p></Layout>} /></Routes></MemoryRouter>);

    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.getByText("Notes").closest("main")).toHaveClass("pb-24");
  });

  it("should leave note creation without bottom navigation", (): void => {
    render(<MemoryRouter initialEntries={["/note/create"]}><Routes><Route path="/note/create" element={<Layout><p>New note</p></Layout>} /></Routes></MemoryRouter>);

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});
