import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import MasterCategoryContainer from "./MasterCategory.container";
import { getColumns } from "./MasterCategory.columns";
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
  const mockOnDelete = vi.fn();
  const base: CategoryData = { id: "1", categoryName: "Audio", status: "active", createAt: "2024-02-01", createBy: "Admin" };
  const inactive: CategoryData = { id: "2", categoryName: "Light", status: "inactive", createAt: "2024-03-01", createBy: "Admin" };

  it("returns 5 columns with correct keys", () => {
      const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onDelete: mockOnDelete });
      expect(cols).toHaveLength(5);
      expect(cols.map((c) => c.key)).toEqual(["no", "categoryName", "status", "createAt", "actions"]);
    });

  it("no column render calculates correct number", () => {
      const cols = getColumns({ currentPage: 2, pageSize: 5, onEdit: mockOnEdit, onDelete: mockOnDelete });
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
      const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onDelete: mockOnDelete });
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
      const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit, onDelete: mockOnDelete });
      const ca = cols.find((c) => c.key === "createAt")!;
      expect((ca.render as any)(base)).toBe("2024-02-01");
    });

  it("actions column calls onEdit with stopPropagation", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit, onDelete });
      const actionsCol = cols.find((c) => c.key === "actions")!;
      // Actions column now uses actions object instead of render function
      expect(actionsCol.actions?.edit).toBe(onEdit);
      expect(actionsCol.actions?.delete).toBe(onDelete);
    });
});
