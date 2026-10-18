import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { PaymentTypeData } from "../MasterPaymentType.type";
import { MasterPaymentTypeDetailComponent } from "./MasterPaymentTypeDetail.component";
import type { MasterPaymentTypeDetailState } from "./MasterPaymentTypeDetail.type";

describe("MasterPaymentTypeDetail.component", () => {
  const mockPaymentType: PaymentTypeData = {
    id: "pt-101",
    name: "Full Payment",
    status: "active",
    createAt: "2026-03-01 10:00:00",
    createBy: "Admin",
  };

  const defaultProps: MasterPaymentTypeDetailState = {
    paymentType: mockPaymentType,
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

  it("should render not found state when paymentType is null", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentTypeDetailComponent, {
          ...defaultProps,
          paymentType: null,
        }),
      ),
    );

    expect(screen.getByText("Payment Type not found")).not.toBeNull();
  });

  it("should render payment type details and status badge", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentTypeDetailComponent, defaultProps),
      ),
    );

    expect(screen.getAllByText("Full Payment").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("pt-101")).not.toBeNull();
    expect(screen.getByText("active")).not.toBeNull();
  });

  it("should trigger goBack when Back button is clicked", () => {
    const goBack = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentTypeDetailComponent, {
          ...defaultProps,
          goBack,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it("should toggle more menu and handle edit and delete triggers", () => {
    const toggleMore = jest.fn();
    const goEdit = jest.fn();
    const openDeleteModal = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentTypeDetailComponent, {
          ...defaultProps,
          isMoreOpen: true,
          toggleMore,
          goEdit,
          openDeleteModal,
        }),
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(toggleMore).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(goEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(openDeleteModal).toHaveBeenCalledTimes(1);
  });

  it("should render delete modal and handle close and confirm delete", () => {
    const closeDeleteModal = jest.fn();
    const handleDelete = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterPaymentTypeDetailComponent, {
          ...defaultProps,
          isDeleteModalOpen: true,
          closeDeleteModal,
          handleDelete,
        }),
      ),
    );

    expect(screen.getByText("Delete payment type?")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeDeleteModal).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
