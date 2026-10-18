import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { RoleData } from "../MasterRole.type";
import { MasterRoleDetailComponent } from "./MasterRoleDetail.component";
import type { MasterRoleDetailState } from "./MasterRoleDetail.type";

describe("MasterRoleDetail.component", () => {
  const mockRole: RoleData = {
    id: "role-1",
    roleName: "Finance Administrator",
    status: "active",
    createAt: "2026-03-01 10:00:00",
    createBy: "Super Admin",
  };

  const defaultProps: MasterRoleDetailState = {
    role: mockRole,
    isMoreOpen: false,
    isDeleteModalOpen: false,
    goBack: jest.fn(),
    toggleMore: jest.fn(),
    closeMore: jest.fn(),
    goEdit: jest.fn(),
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    handleDelete: jest.fn(),
  };

  it("should render not found state when role is null", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterRoleDetailComponent, {
          ...defaultProps,
          role: null,
        }),
      ),
    );

    expect(screen.getByText("Role not found")).not.toBeNull();
  });

  it("should render role details and record info", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterRoleDetailComponent, defaultProps),
      ),
    );

    expect(screen.getAllByText("Finance Administrator").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("role-1")).not.toBeNull();
    expect(screen.getByText("active")).not.toBeNull();
    expect(screen.getByText("Super Admin")).not.toBeNull();
    expect(screen.getByText("2026-03-01 10:00:00")).not.toBeNull();
  });

  it("should trigger goBack when back button is clicked", () => {
    const goBack = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterRoleDetailComponent, {
          ...defaultProps,
          goBack,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it("should toggle more menu and handle edit and delete actions", () => {
    const toggleMore = jest.fn();
    const goEdit = jest.fn();
    const openDeleteModal = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterRoleDetailComponent, {
          ...defaultProps,
          isMoreOpen: true,
          toggleMore,
          goEdit,
          openDeleteModal,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "More options" }));
    expect(toggleMore).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(goEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(openDeleteModal).toHaveBeenCalledTimes(1);
  });

  it("should render delete modal and handle close and delete actions", () => {
    const closeDeleteModal = jest.fn();
    const handleDelete = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterRoleDetailComponent, {
          ...defaultProps,
          isDeleteModalOpen: true,
          closeDeleteModal,
          handleDelete,
        }),
      ),
    );

    expect(screen.getByText("Delete role?")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeDeleteModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
