import type * as React from "react";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { OrderComponent } from "./Order.component";
import type { OrderProps, QuoteData } from "./Order.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} - Wrapper element
   */
  default: (props: React.PropsWithChildren): React.ReactElement => <div>{props.children}</div>,
}));

const ORDER: QuoteData = {
  id: "order-1", name: "Annual Meeting", startDate: "01/11/2026", endDate: "02/11/2026", location: "Jakarta", category: "", selectedItems: [],
  qty: 1, pph: 0, discount: 0, remark: "", grandTotal: 1500000, status: 1, customerPhone: "0812",
};

/**
 * Build order list props.
 * @param {Partial<OrderProps>} [overrides] - Props to override
 * @returns {OrderProps} - Order list props
 */
const buildProps = (overrides?: Partial<OrderProps>): OrderProps => ({
  canCreateOrder: true, openCreateModal: jest.fn(), openEditModal: jest.fn(), onRowClick: jest.fn(), onBack: jest.fn(),
  paginatedData: [ORDER], currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 1, isLoading: false, errorMessage: null, isEmpty: false,
  goToPage: jest.fn(), changePageSize: jest.fn(), setSearchTerm: jest.fn(), ...overrides,
});

describe("OrderComponent", (): void => {
  it("should render orders and trigger row, edit, create and search callbacks", (): void => {
    const props = buildProps();

    render(<OrderComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: /Annual Meeting/ })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Edit order" }));
    fireEvent.click(screen.getByRole("button", { name: "Create Order" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search order")[0], { target: { value: "annual" } });

    expect(props.onRowClick).toHaveBeenCalledWith(ORDER);
    expect(props.openEditModal).toHaveBeenCalledWith(ORDER);
    expect(props.openCreateModal).toHaveBeenCalledTimes(1);
    expect(props.setSearchTerm).toHaveBeenCalledWith("annual");
    expect(screen.getByText("Rp 1.500.000")).toBeTruthy();
  });

  it("should show inactive status and hide create actions on the draft list", (): void => {
    render(<OrderComponent {...buildProps({ canCreateOrder: false, paginatedData: [{ ...ORDER, status: 0 }] })} />);

    expect(screen.getByText("inactive")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Create Order" })).toBeNull();
  });

  it.each([
    [{ isLoading: true }, "Loading orders…"],
    [{ errorMessage: "Unable to load orders." }, "Unable to load orders."],
    [{ isEmpty: true, paginatedData: [] }, "No orders found."],
  ])("should show the list state message", (overrides: Partial<OrderProps>, message: string): void => {
    render(<OrderComponent {...buildProps(overrides)} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });
});
