import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import type { VoucherData } from "../MasterVoucher.type";
import { MasterVoucherDetailComponent } from "./MasterVoucherDetail.component";
import type { MasterVoucherDetailState } from "./MasterVoucherDetail.type";

describe("MasterVoucherDetail.component", () => {
  const mockVoucher: VoucherData = {
    id: "vc-1",
    code: "DISC50",
    name: "Diskon 50 Persen",
    discountPercent: 50,
    status: "active",
    createAt: "2026-03-01 10:00:00",
    createBy: "Admin",
  };

  const defaultProps: MasterVoucherDetailState = {
    voucher: mockVoucher,
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

  it("should render not found state when voucher is null", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterVoucherDetailComponent, {
          ...defaultProps,
          voucher: null,
        }),
      ),
    );

    expect(screen.getByText("Voucher not found")).not.toBeNull();
  });

  it("should render voucher details and overview card", () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterVoucherDetailComponent, defaultProps),
      ),
    );

    expect(screen.getByText("DISC50")).not.toBeNull();
    expect(screen.getByText("Diskon 50 Persen")).not.toBeNull();
    expect(screen.getByText("50")).not.toBeNull();
    expect(screen.getByText("2026-03-01 10:00:00")).not.toBeNull();
    expect(screen.getByText("active")).not.toBeNull();
  });

  it("should trigger goBack when Back button is clicked", () => {
    const goBack = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterVoucherDetailComponent, {
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
        React.createElement(MasterVoucherDetailComponent, {
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

  it("should render delete modal and handle close and confirm delete", () => {
    const closeDeleteModal = jest.fn();
    const handleDelete = jest.fn();

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(MasterVoucherDetailComponent, {
          ...defaultProps,
          isDeleteModalOpen: true,
          closeDeleteModal,
          handleDelete,
        }),
      ),
    );

    expect(screen.getByText("Delete Voucher?")).not.toBeNull();
    expect(screen.getByText("Delete DISC50?")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(closeDeleteModal).toHaveBeenCalledTimes(1);

    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    const confirmButton = deleteButtons[deleteButtons.length - 1];
    fireEvent.click(confirmButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
