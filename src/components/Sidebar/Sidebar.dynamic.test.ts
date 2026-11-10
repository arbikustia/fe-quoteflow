import * as React from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";
import SidebarContainer from "./Sidebar.container";
import * as permissionService from "@/services/permission.service";
import * as userService from "@/services/master-user.service";
import * as roleService from "@/services/master-role.service";

jest.mock("@/services/permission.service", () => ({
  useGetUserPermissionQuery: jest.fn(),
}));

jest.mock("@/services/master-user.service", () => ({
  useGetUsersQuery: jest.fn(),
}));

jest.mock("@/services/master-role.service", () => ({
  useGetAllRolesQuery: jest.fn(),
}));

jest.mock("@/services/activity-log.service", () => ({
  useCreateActivityLogMutation: () => [jest.fn()],
}));

describe("SidebarContainer dynamic menu permission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = "quoteflow_username=staf";
  });

  it("should hide master data children without view access", () => {
    jest.mocked(userService.useGetUsersQuery).mockReturnValue({
      data: { status: true, data: [{ username: "staf", role: "role-1" }], messages: [] },
      isLoading: false,
    } as never);

    jest.mocked(roleService.useGetAllRolesQuery).mockReturnValue({
      data: { status: true, data: [{ id: "role-1", role: "Staf", status: 1 }], messages: [] },
      isLoading: false,
    } as never);

    jest.mocked(permissionService.useGetUserPermissionQuery).mockReturnValue({
      data: {
        status: true,
        data: {
          username: "staf",
          menus: [
            {
              menu: "Master Data",
              pages: [
                { page: "Customer", url: "/master-customer", permission: ["view"] },
              ],
            },
          ],
        },
        messages: [],
      },
      isLoading: false,
    } as never);

    render(React.createElement(BrowserRouter, null, React.createElement(SidebarContainer)));

    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.queryByText("Category")).not.toBeInTheDocument();
  });
});