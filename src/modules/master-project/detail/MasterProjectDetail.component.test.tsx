import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { ProjectData } from "../MasterProject.type";
import { MasterProjectDetailComponent } from "./MasterProjectDetail.component";
import type { MasterProjectDetailState } from "./MasterProjectDetail.type";

describe("MasterProjectDetail.component", () => {
  const mockProject: ProjectData = {
    id: "proj-1",
    name: "Living Room Modern Setup",
    remark: "Standard studio equipment package",
    status: "active",
    createAt: "2026-03-01 10:00:00",
    createBy: "Supervisor",
    items: [
      { item_id: "it-1", item_name: "4K Cinema Camera", qty: 2 },
      { item_id: "it-2", item_name: null, qty: 1 },
    ],
  };

  const defaultProps: MasterProjectDetailState = {
    project: mockProject,
    isLoading: false,
    errorMessage: null,
    goBack: jest.fn(),
    goEdit: jest.fn(),
  };

  it("should render loading state when isLoading is true", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, {
          ...defaultProps,
          isLoading: true,
        }),
      ),
    );

    expect(screen.getByText("Loading project…")).not.toBeNull();
  });

  it("should render error message when errorMessage is provided", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, {
          ...defaultProps,
          errorMessage: "Failed to fetch project detail",
        }),
      ),
    );

    expect(screen.getByText("Failed to fetch project detail")).not.toBeNull();
  });

  it("should render fallback not found message when project is null", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, {
          ...defaultProps,
          project: null,
        }),
      ),
    );

    expect(screen.getByText("Project not found")).not.toBeNull();
  });

  it("should render project details and items correctly", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, defaultProps),
      ),
    );

    expect(screen.getAllByText("Living Room Modern Setup").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("proj-1")).not.toBeNull();
    expect(screen.getByText("Standard studio equipment package")).not.toBeNull();
    expect(screen.getByText("4K Cinema Camera")).not.toBeNull();
    expect(screen.getByText("it-2")).not.toBeNull();
    expect(screen.getByText("Qty: 2")).not.toBeNull();
    expect(screen.getByText("Qty: 1")).not.toBeNull();
    expect(screen.getByText("Supervisor")).not.toBeNull();
    expect(screen.getByText("2026-03-01 10:00:00")).not.toBeNull();
  });

  it("should render empty items message when project has no items", () => {
    const projectWithoutItems: ProjectData = {
      ...mockProject,
      items: [],
      remark: "",
    };

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, {
          ...defaultProps,
          project: projectWithoutItems,
        }),
      ),
    );

    expect(screen.getByText("No items selected.")).not.toBeNull();
    expect(screen.getByText("-")).not.toBeNull();
  });

  it("should trigger goBack and goEdit when action buttons are clicked", () => {
    const goBack = jest.fn();
    const goEdit = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterProjectDetailComponent, {
          ...defaultProps,
          goBack,
          goEdit,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(goBack).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(goEdit).toHaveBeenCalledTimes(1);
  });
});
