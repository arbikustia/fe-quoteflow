import { act, renderHook } from "@testing-library/react";

import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  it("should paginate data by page size", () => {
    const { result } = renderHook(() => usePagination(data, 5));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(11);
    expect(result.current.paginatedData).toEqual([1, 2, 3, 4, 5]);
  });

  it("should go to a bounded page with goToPage", () => {
    const { result } = renderHook(() => usePagination(data, 5));

    act(() => result.current.goToPage(2));
    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedData).toEqual([6, 7, 8, 9, 10]);

    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
  });

  it("should move to next and previous page", () => {
    const { result } = renderHook(() => usePagination(data, 5));

    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(2);

    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to first page when page size changes", () => {
    const { result } = renderHook(() => usePagination(data, 5));

    act(() => result.current.goToPage(3));

    act(() => result.current.changePageSize(10));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.paginatedData).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("should return at least one page for empty data", () => {
    const { result } = renderHook(() => usePagination<number>([], 5));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });
});
