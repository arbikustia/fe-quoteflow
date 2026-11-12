import type { ChangeEvent } from "react";

import { act, renderHook } from "@/libs/unit-test";

import { useMasterUser } from "./MasterUser.hook";

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

describe("useMasterUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should start on the first page with the default page size", () => {
    const { result } = renderHook(useMasterUser);

    expect(result.current.queryParams).toEqual({ PageNumber: 1, PageSize: 10, SearchTerm: "" });
  });

  it("should change page but never go below the first page", () => {
    const { result } = renderHook(useMasterUser);

    act(() => result.current.handlePageChange(3));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.handlePageChange(0));
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to the first page when page size or search changes", () => {
    const { result } = renderHook(useMasterUser);

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageSizeChange(20));
    expect(result.current.queryParams).toEqual({ PageNumber: 1, PageSize: 20, SearchTerm: "" });

    act(() => result.current.handlePageChange(2));
    act(() => result.current.handleSearchChange(createSearchEvent("admin")));
    expect(result.current.queryParams).toEqual({ PageNumber: 1, PageSize: 20, SearchTerm: "admin" });
  });

  it("should navigate to master main, create and edit pages by id", () => {
    const { result } = renderHook(useMasterUser);

    act(result.current.handleBack);
    act(result.current.handleCreate);
    act(() => result.current.handleEdit({ id: "user-1", username: "arbikustia14", email: "-", role: "Administrator", status: "active", createdAt: "-" }));

    expect(mockNavigate.mock.calls).toEqual([
      ["/master-main"],
      ["/master-user/create"],
      ["/master-user/edit/user-1"],
    ]);
  });
});
