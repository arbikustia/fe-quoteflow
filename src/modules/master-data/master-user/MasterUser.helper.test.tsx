import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createEditClickHandler,
  getUserColumns,
  getUserRowKey,
  renderUserMobileCard,
} from "./MasterUser.helper";
import type { UserData } from "./MasterUser.type";

const USER: UserData = {
  id: "user-1",
  username: "arbikustia14",
  email: "arbi@example.com",
  role: "Administrator",
  status: "inactive",
  createdAt: "30 Oktober 2026 22:00",
};

describe("MasterUser helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(USER, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(USER);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getUserColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "username", "email", "role", "status", "createdAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(USER, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("arbikustia14")).toBeInTheDocument();
    expect(screen.getByText("arbi@example.com")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit user arbikustia14" }));
    expect(onEdit).toHaveBeenCalledWith(USER);
  });

  it("should hide the action column without edit permission", () => {
    expect(getUserColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the user id as the row key", () => {
    expect(getUserRowKey(USER)).toBe("user-1");
  });

  it("should render a mobile card with the email, role and creation date that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderUserMobileCard({ user: USER, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("arbi@example.com")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
    expect(screen.getByText("30 Oktober 2026 22:00")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(USER);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderUserMobileCard({ user: USER, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
