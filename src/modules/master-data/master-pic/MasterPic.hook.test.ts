import type { ChangeEvent } from "react";

import { act, renderHook } from "@/libs/unit-test";

import { useMasterPic } from "./MasterPic.hook";

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

describe("useMasterPic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start on the first page with the default page size", () => {
    const { result } = renderHook(useMasterPic);

    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

  it("should change page but never go below the first page", () => {
    const { result } = renderHook(useMasterPic);

    act(() => result.current.handlePageChange(3));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.handlePageChange(0));
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to the first page when page size or search changes", () => {
    const { result } = renderHook(useMasterPic);

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageSizeChange(20));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "" });

    act(() => result.current.handlePageChange(2));
    act(() => result.current.handleSearchChange(createSearchEvent("aurora")));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "aurora" });
  });

  it("should navigate to master main, create and edit pages", () => {
    const { result } = renderHook(useMasterPic);

    act(result.current.handleBack);
    act(result.current.handleCreate);
    act(() => result.current.handleEdit({ id: "pic-1", name: "Aurora", status: "active", createdAt: "-" }));

    expect(mockNavigate.mock.calls).toEqual([["/master-main"], ["/master-pic/create"], ["/master-pic/edit/pic-1", { state: { pic: { id: "pic-1", name: "Aurora", status: "active", createdAt: "-" } } }]]);
  });
});
