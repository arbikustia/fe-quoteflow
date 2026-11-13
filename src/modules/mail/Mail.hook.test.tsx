import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { act, renderHook } from "@/libs/unit-test";

import { useMailNavigation, useMailPagination } from "./Mail.hook";

const mockNavigate = jest.fn();
const mockQuery = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("@/services/mail/mail.service", () => ({
  mapMail: (mail: { id: string }): { id: string } => ({ id: mail.id }),
  useGetMailsQuery: (...args: unknown[]): unknown => mockQuery(...args),
}));

const wrapper = ({ children }: { children: ReactNode }): ReactNode => <MemoryRouter>{children}</MemoryRouter>;

describe("useMailNavigation", () => {
  it("should navigate home and to compose", () => {
    const { result } = renderHook(() => useMailNavigation(), { wrapper });

    result.current.goBack();
    result.current.goCompose();
    expect(mockNavigate).toHaveBeenCalledWith("/home");
    expect(mockNavigate).toHaveBeenCalledWith("/mail/create");
  });
});

describe("useMailPagination", () => {
  it("should expose loading state", () => {
    mockQuery.mockReturnValue({ isLoading: true });
    const { result } = renderHook(() => useMailPagination());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEmpty).toBe(false);
  });

  it("should expose an error message when the request fails", () => {
    mockQuery.mockReturnValue({ error: {}, isLoading: false });
    const { result } = renderHook(() => useMailPagination());

    expect(result.current.errorMessage).toBe("Unable to load mails.");
  });

  it("should flag a response without data", () => {
    mockQuery.mockReturnValue({ data: {}, isLoading: false });
    const { result } = renderHook(() => useMailPagination());

    expect(result.current.isMissingData).toBe(true);
    expect(result.current.isEmpty).toBe(false);
  });

  it("should map rows and flag an empty list", () => {
    mockQuery.mockReturnValue({ data: { data: [], total_pages: 0, total_count: 0 }, isLoading: false });
    const { result } = renderHook(() => useMailPagination());

    expect(result.current.isEmpty).toBe(true);
    mockQuery.mockReturnValue({ data: { data: [{ id: "m1" }], total_pages: 3, total_count: 25 }, isLoading: false });
    const { result: filled } = renderHook(() => useMailPagination());

    expect(filled.current.paginatedData).toEqual([{ id: "m1" }]);
    expect(filled.current.totalCount).toBe(25);
  });

  it("should clamp pages and reset to page one on size or search change", () => {
    mockQuery.mockReturnValue({ data: { data: [], total_pages: 3, total_count: 25 }, isLoading: false });
    const { result } = renderHook(() => useMailPagination());

    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.changePageSize(20));
    expect(result.current.pageSize).toBe(20);
    expect(result.current.currentPage).toBe(1);
    act(() => result.current.goToPage(2));
    act(() => result.current.setSearchTerm("quo"));
    expect(result.current.currentPage).toBe(1);
    expect(mockQuery).toHaveBeenLastCalledWith({ pageNumber: 1, pageSize: 20, searchTerm: "quo" });
  });
});
