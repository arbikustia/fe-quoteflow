import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { getColumns } from "./MasterRole.columns";
import MasterRoleContainer from "./MasterRole.container";
import type { RoleData } from "./MasterRole.type";

const mockRole: RoleData = {
  id: "1",
  roleName: "Admin",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

describe("MasterRoleContainer", () => {
  it("renders container component correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterRoleContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterRoleContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const onEdit = vi.fn();
  const columns = getColumns({ currentPage: 1, pageSize: 10, onEdit });

  it("returns columns correctly", () => {
    expect(columns).toHaveLength(5);
    expect(columns[0].key).toBe("no");
    expect(columns[1].key).toBe("roleName");
    expect(columns[2].key).toBe("status");
    expect(columns[3].key).toBe("createAt");
    expect(columns[4].key).toBe("actions");
  });

  it("renders status column correctly", () => {
    const statusCol = columns.find((c) => c.key === "status");
    expect(statusCol).toBeDefined();
    
    if (statusCol?.render) {
      const activeRender = render(statusCol.render({ ...mockRole, status: "active" }, 0));
      expect(activeRender.container.textContent).toContain("active");
      
      const inactiveRender = render(statusCol.render({ ...mockRole, status: "inactive" }, 0));
      expect(inactiveRender.container.textContent).toContain("inactive");
    }
  });

  it("renders no column correctly", () => {
    const noCol = columns.find((c) => c.key === "no");
    expect(noCol).toBeDefined();

    if (noCol?.render) {
      const { container } = render(noCol.render(mockRole, 0));
      expect(container.textContent).toBe("1");
    }
  });

  it("renders actions column correctly", () => {
    const actionsCol = columns.find((c) => c.key === "actions");
    expect(actionsCol).toBeDefined();

    if (actionsCol?.render) {
      const { container } = render(actionsCol.render(mockRole, 0));
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
      
      if (button) {
        fireEvent.click(button);
        expect(onEdit).toHaveBeenCalledWith(mockRole);
      }
    }
  });
});
