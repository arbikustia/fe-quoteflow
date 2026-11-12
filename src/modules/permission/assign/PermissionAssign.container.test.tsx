import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import PermissionAssignContainer from "./PermissionAssign.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: () => <div data-testid="user-select" /> }));
jest.mock("@/services/master-user.service", () => ({ useGetUsersQuery: () => ({ data: { data: [] }, isLoading: false }) }));
jest.mock("@/services/permission.service", () => ({
  useGetUserPermissionQuery: () => ({}),
  useSaveUserPermissionMutation: () => [jest.fn(), { isLoading: false }],
}));

const renderAssign = (): void => {
  render(
    <MemoryRouter initialEntries={["/permission/assign/admin"]}>
      <Routes><Route path="/permission/assign/:username" element={<PermissionAssignContainer />} /></Routes>
    </MemoryRouter>,
  );
};

describe("PermissionAssignContainer", () => {
  it("should check and uncheck every permission via select all", () => {
    renderAssign();
    const selectAll = screen.getByRole("checkbox", { name: "Select all permissions" });
    const permissionBoxes = (): HTMLElement[] => screen.getAllByRole("checkbox").filter((box) => box !== selectAll && !box.getAttribute("aria-label")?.startsWith("Select all "));

    expect(selectAll).not.toBeChecked();
    fireEvent.click(selectAll);
    expect(selectAll).toBeChecked();
    permissionBoxes().forEach((box) => expect(box).toBeChecked());
    expect(screen.getByRole("checkbox", { name: "Dashboard view" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Dashboard create" })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Dashboard edit" })).not.toBeInTheDocument();

    fireEvent.click(permissionBoxes()[0]);
    expect(selectAll).not.toBeChecked();

    fireEvent.click(selectAll);
    fireEvent.click(selectAll);
    permissionBoxes().forEach((box) => expect(box).not.toBeChecked());
  });

  it("should check and uncheck every permission in one row via row select", () => {
    renderAssign();
    const rowBox = screen.getAllByRole("checkbox", { name: /^Select all .+ permissions$/ })[1];
    const row = rowBox.closest("tr");
    const rowPermissions = (): HTMLElement[] => Array.from(row?.querySelectorAll<HTMLElement>("input[type=checkbox]") ?? []);

    fireEvent.click(rowBox);
    rowPermissions().forEach((box) => expect(box).toBeChecked());
    expect(screen.getByRole("checkbox", { name: "Select all permissions" })).not.toBeChecked();

    fireEvent.click(rowBox);
    rowPermissions().forEach((box) => expect(box).not.toBeChecked());
  });
});
