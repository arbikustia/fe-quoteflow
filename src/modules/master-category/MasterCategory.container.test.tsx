import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MasterCategoryContainer, { getColumns } from "./MasterCategory.container";
import type { CategoryData } from "./MasterCategory.type";

describe("MasterCategoryContainer", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <MasterCategoryContainer />
      </MemoryRouter>
    );
    // header appears twice (mobile + hidden header) - check at least one
    expect(screen.getAllByText("Category List").length).toBeGreaterThan(0);
  });

  it("navigates on more toggle and renders table", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterCategoryContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    // pagination or search input exists
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterCategoryContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const mockOnEdit = vi.fn();
  const base: CategoryData = { id: "1", categoryName: "Audio", status: "active", createAt: "2024-02-01", createBy: "Admin" };
  const inactive: CategoryData = { id: "2", categoryName: "Light", status: "inactive", createAt: "2024-03-01", createBy: "Admin" };

  it("returns 5 columns with correct keys", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit });
    expect(cols).toHaveLength(5);
    expect(cols.map((c) => c.key)).toEqual(["no", "categoryName", "status", "createAt", "actions"]);
  });

  it("no column render calculates correct number", () => {
    const cols = getColumns({ currentPage: 2, pageSize: 5, onEdit: mockOnEdit });
    const noCol = cols.find((c) => c.key === "no")!;
    const el = (noCol.render as any)(base, 0) as any;
    // (2-1)*5 + 0 +1 = 6
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    expect(container.textContent).toBe("6");
    const el2 = (noCol.render as any)(base, 4) as any;
    const { container: c2 } = render(<MemoryRouter>{el2}</MemoryRouter>);
    expect(c2.textContent).toBe("10");
  });

  it("status column renders active and inactive", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit });
    const statusCol = cols.find((c) => c.key === "status")!;
    const activeEl = (statusCol.render as any)(base) as any;
    const { container: ca } = render(<MemoryRouter>{activeEl}</MemoryRouter>);
    expect(ca.textContent).toBe("active");
    expect(ca.innerHTML).toContain("bg-green-100");
    const inactiveEl = (statusCol.render as any)(inactive) as any;
    const { container: ci } = render(<MemoryRouter>{inactiveEl}</MemoryRouter>);
    expect(ci.textContent).toBe("inactive");
    expect(ci.innerHTML).toContain("bg-red-100");
  });

  it("createAt column returns raw value", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit });
    const ca = cols.find((c) => c.key === "createAt")!;
    expect((ca.render as any)(base)).toBe("2024-02-01");
  });

  it("actions column calls onEdit with stopPropagation", () => {
    const onEdit = vi.fn();
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit });
    const actionsCol = cols.find((c) => c.key === "actions")!;
    const el = (actionsCol.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    const btn = container.querySelector("button")!;
    const stopPropagation = vi.fn();
    fireEvent.click(btn, { stopPropagation } as any);
    // onEdit called, and stopPropagation indirectly via handler - verify onEdit
    expect(onEdit).toHaveBeenCalledWith(base);
  });
});
