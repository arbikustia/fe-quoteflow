import type { ChangeEvent } from "react";

import { act, renderHook } from "@/libs/unit-test";

import { useMasterOrderType } from "./MasterOrderType.hook";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));

/**
 * Build a search input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const createSearchEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useMasterOrderType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start on the first page with the default page size", () => {
    const { result } = renderHook(useMasterOrderType);

    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

  it("should change page but never go below the first page", () => {
    const { result } = renderHook(useMasterOrderType);

    act(() => result.current.handlePageChange(3));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.handlePageChange(0));
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to the first page when page size or search changes", () => {
    const { result } = renderHook(useMasterOrderType);

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageSizeChange(20));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "" });

    act(() => result.current.handlePageChange(2));
    act(() => result.current.handleSearchChange(createSearchEvent("delivery")));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "delivery" });
  });

  it("should navigate to master main, create and edit pages", () => {
    const { result } = renderHook(useMasterOrderType);

    act(result.current.handleBack);
    act(result.current.handleCreate);
    act(() => result.current.handleEdit({ id: "order-type-1", name: "Delivery", isHandover: "yes", status: "active", createdAt: "-" }));

    expect(mockNavigate.mock.calls).toEqual([["/master-main"], ["/master-order-type/create"], ["/master-order-type/edit/order-type-1"]]);
  });
});
