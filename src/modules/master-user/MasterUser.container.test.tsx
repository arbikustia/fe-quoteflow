import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { getColumns } from "./MasterUser.columns";
import MasterUserContainer from "./MasterUser.container";
import type { UserData } from "./MasterUser.type";

describe("MasterUserContainer", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <MasterUserContainer />
      </MemoryRouter>
    );
    expect(screen.getAllByText("User List").length).toBeGreaterThan(0);
  });

  it("navigates on more toggle and renders table", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterUserContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterUserContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const mockOnEdit = vi.fn();
  const base: UserData = { id: "1", username: "admin1", role: "Admin", status: "active", createAt: "2024-01-01", createBy: "Admin" };
  const inactive: UserData = { id: "2", username: "user1", role: "User", status: "inactive", createAt: "2024-01-02", createBy: "Admin" };

  it("returns columns with correct keys", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit });
    expect(cols).toHaveLength(6);
    expect(cols.map((c) => c.key)).toEqual(["no","username","role","status","createAt","actions"]);
  });

  it("no column render calculates correct number", () => {
    const cols = getColumns({ currentPage: 2, pageSize: 5, onEdit: mockOnEdit });
    const noCol = cols.find((c) => c.key === "no")!;
    const el = (noCol.render as any)(base, 0) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    expect(container.textContent).toBe("6");
    const el2 = (noCol.render as any)(base, 4) as any;
    const { container: c2 } = render(<MemoryRouter>{el2}</MemoryRouter>);
    expect(c2.textContent).toBe("10");
  });

  it("role column renders properly", () => {
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit: mockOnEdit });
    const roleCol = cols.find((c) => c.key === "role")!;
    const adminEl = (roleCol.render as any)(base) as any;
    const { container: ca } = render(<MemoryRouter>{adminEl}</MemoryRouter>);
    expect(ca.textContent).toBe("Admin");
    expect(ca.innerHTML).toContain("text-brand-blue");

    const userEl = (roleCol.render as any)(inactive) as any;
    const { container: cu } = render(<MemoryRouter>{userEl}</MemoryRouter>);
    expect(cu.textContent).toBe("User");
    expect(cu.innerHTML).toContain("text-brand-text-medium");
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

  it("actions column calls onEdit with stopPropagation", () => {
    const onEdit = vi.fn();
    const cols = getColumns({ currentPage: 1, pageSize: 5, onEdit });
    const actionsCol = cols.find((c) => c.key === "actions")!;
    const el = (actionsCol.render as any)(base) as any;
    const { container } = render(<MemoryRouter>{el}</MemoryRouter>);
    const btns = container.querySelectorAll("button");
    expect(btns.length).toBe(1);
    fireEvent.click(btns[0]);
    expect(onEdit).toHaveBeenCalledWith(base);
  });
});
