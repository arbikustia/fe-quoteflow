import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { PaymentMethodData } from "../MasterPaymentMethod.type";
import { MasterPaymentMethodDetailComponent } from "./MasterPaymentMethodDetail.component";
import type { MasterPaymentMethodDetailState } from "./MasterPaymentMethodDetail.type";

describe("MasterPaymentMethodDetail.component", () => {
  const mockPaymentMethod: PaymentMethodData = {
    id: "pm-1",
    name: "Bank Transfer BCA",
    description: "Automatic verification BCA",
    status: "active",
    createAt: "2026-03-01 10:00:00",
    createBy: "Admin",
  };

  const defaultProps: MasterPaymentMethodDetailState = {
    paymentMethod: mockPaymentMethod,
    goBack: jest.fn(),
    goEdit: jest.fn(),
    handleDelete: jest.fn(),
    isMoreOpen: false,
    isDeleteModalOpen: false,
    toggleMore: jest.fn(),
    closeMore: jest.fn(),
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
  };

  it("should render not found state when paymentMethod is null", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          paymentMethod: null,
        }),
      ),
    );

    expect(screen.getByText("Payment Method not found")).not.toBeNull();
  });

  it("should render payment method details correctly", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, defaultProps),
      ),
    );

    expect(screen.getAllByText("Bank Transfer BCA").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Automatic verification BCA")).not.toBeNull();
    expect(screen.getByText("pm-1")).not.toBeNull();
    expect(screen.getByText("Admin")).not.toBeNull();
    expect(screen.getByText("2026-03-01 10:00:00")).not.toBeNull();
    expect(screen.getByText("active")).not.toBeNull();
  });

  it("should trigger goBack when back button is clicked", () => {
    const goBack = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          goBack,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it("should trigger toggleMore when more options button is clicked", () => {
    const toggleMore = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          toggleMore,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "More options" }));
    expect(toggleMore).toHaveBeenCalledTimes(1);
  });

  it("should render more dropdown and trigger actions when open", () => {
    const goEdit = jest.fn();
    const openDeleteModal = jest.fn();
    const closeMore = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          isMoreOpen: true,
          goEdit,
          openDeleteModal,
          closeMore,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(goEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(openDeleteModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(closeMore).toHaveBeenCalledTimes(1);
  });

  it("should render delete modal and handle cancel and delete actions", () => {
    const handleDelete = jest.fn();
    const closeDeleteModal = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          isDeleteModalOpen: true,
        }),
      ),
    );

    expect(screen.getByText("Delete payment method?")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(defaultProps.closeDeleteModal).toHaveBeenCalledTimes(1);

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentMethodDetailComponent, {
          ...defaultProps,
          isDeleteModalOpen: true,
          handleDelete,
          closeDeleteModal,
        }),
      ),
    );

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    const modalDeleteBtn = deleteButtons[deleteButtons.length - 1];
    fireEvent.click(modalDeleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
