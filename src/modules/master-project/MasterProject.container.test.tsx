import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { getColumns } from "./MasterProject.columns";
import MasterProjectContainer from "./MasterProject.container";
import type { ProjectData } from "./MasterProject.type";

const mockProject: ProjectData = {
  id: "1",
  name: "Website Revamp",
  items: [{ itemId: "ITM001", qty: 2 }],
  remark: "High priority",
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

describe("MasterProjectContainer", () => {
  it("renders container component correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <MasterProjectContainer />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
    expect(screen.getAllByPlaceholderText(/Search/i).length).toBeGreaterThan(0);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterProjectContainer />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("getColumns", () => {
  const onEdit = vi.fn();
  const columns = getColumns({ currentPage: 1, pageSize: 10, onEdit });

  it("returns columns correctly", () => {
    expect(columns).toHaveLength(7);
    expect(columns[0].key).toBe("no");
    expect(columns[1].key).toBe("name");
    expect(columns[2].key).toBe("items");
    expect(columns[3].key).toBe("remark");
    expect(columns[4].key).toBe("status");
    expect(columns[5].key).toBe("createBy");
    expect(columns[6].key).toBe("actions");
  });

  it("renders status column correctly", () => {
    const statusCol = columns.find((c) => c.key === "status");
    expect(statusCol).toBeDefined();
    
    if (statusCol?.render) {
      const activeRender = render(statusCol.render({ ...mockProject, status: "active" }, 0));
      expect(activeRender.container.textContent).toContain("active");
      
      const inactiveRender = render(statusCol.render({ ...mockProject, status: "inactive" }, 0));
      expect(inactiveRender.container.textContent).toContain("inactive");
    }
  });

  it("renders no column correctly", () => {
    const noCol = columns.find((c) => c.key === "no");
    expect(noCol).toBeDefined();

    if (noCol?.render) {
      const { container } = render(noCol.render(mockProject, 0));
      expect(container.textContent).toBe("1");
    }
  });

  it("renders actions column correctly", () => {
    const actionsCol = columns.find((c) => c.key === "actions");
    expect(actionsCol).toBeDefined();

    if (actionsCol?.render) {
      const { container } = render(actionsCol.render(mockProject, 0));
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
      
      if (button) {
        fireEvent.click(button);
        expect(onEdit).toHaveBeenCalledWith(mockProject);
      }
    }
  });
});
