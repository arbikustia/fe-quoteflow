import { fireEvent, render, screen } from "@/libs/unit-test";

import { _createEditClickHandler, getProjectColumns, getProjectRowKey, renderProjectMobileCard } from "./MasterProject.helper";
import type { ProjectData } from "./MasterProject.type";

const PROJECT: ProjectData = {
  id: "project-1",
  name: "Wedding Package",
  remark: "Full stage setup",
  status: "active",
  createdAt: "4 November 2026 19:49",
  itemCount: 2,
};

describe("MasterProject helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(PROJECT, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(PROJECT);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getProjectColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "remark", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(PROJECT, 0)}</div>)}</div>);
    fireEvent.click(screen.getByRole("button", { name: "Edit project Wedding Package" }));

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Full stage setup")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(PROJECT);
  });

  it("should omit the action column without edit permission", () => {
    expect(getProjectColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the project id as row key", () => {
    expect(getProjectRowKey(PROJECT)).toBe("project-1");
  });

  it("should render a mobile card that edits on click and is disabled without permission", () => {
    const onEdit = jest.fn();
    const { rerender } = render(renderProjectMobileCard({ project: PROJECT, canEdit: true, onEdit }));

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("2 item(s)")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(PROJECT);

    rerender(renderProjectMobileCard({ project: PROJECT, canEdit: false, onEdit }));
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
