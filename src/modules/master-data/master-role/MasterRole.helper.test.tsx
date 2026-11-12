import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getRoleColumns,
  getRoleRowKey,
  renderRoleMobileCard,
} from "./MasterRole.helper";
import type { RoleData } from "./MasterRole.type";

const ROLE: RoleData = {
  id: "role-1",
  name: "Administrator",
  status: "inactive",
  createdAt: "30 Oktober 2026 22:00",
};

describe("MasterRole helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(ROLE, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(ROLE);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getRoleColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "name", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(ROLE, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit role Administrator" }));
    expect(onEdit).toHaveBeenCalledWith(ROLE);
  });

  it("should hide the action column without edit permission", () => {
    expect(getRoleColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the role id as the row key", () => {
    expect(getRoleRowKey(ROLE)).toBe("role-1");
  });

  it("should render a mobile card with the creation date that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderRoleMobileCard({ role: ROLE, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(ROLE);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderRoleMobileCard({ role: ROLE, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
