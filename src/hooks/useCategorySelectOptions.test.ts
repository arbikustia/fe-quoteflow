import { renderHook } from "@/libs/unit-test";
import { useGetAllCategoriesQuery } from "@/services/master-category.service";

import { _formatCategoryMessages, useCategorySelectOptions } from "./useCategorySelectOptions";

jest.mock("@/services/master-category.service", () => ({ useGetAllCategoriesQuery: jest.fn() }));

type MockQueryState = Record<"data" | "isError" | "isLoading", unknown>;

/**
 * Mock the category lookup query state.
 * @param {MockQueryState} state - Query state
 * @returns {void}
 */
const mockQuery = (state: MockQueryState): void => {
  jest.mocked(useGetAllCategoriesQuery).mockReturnValue(state as never);
};

describe("useCategorySelectOptions", () => {
  it("should return loading state", () => {
    mockQuery({ data: undefined, isError: false, isLoading: true });

    expect(renderHook(useCategorySelectOptions).result.current).toEqual({ categories: [], isLoading: true, errorMessage: null });
  });

  it("should return a load error", () => {
    mockQuery({ data: undefined, isError: true, isLoading: false });

    expect(renderHook(useCategorySelectOptions).result.current.errorMessage).toBe("Unable to load categories.");
  });

  it("should return a missing response error", () => {
    mockQuery({ data: undefined, isError: false, isLoading: false });

    expect(renderHook(useCategorySelectOptions).result.current.errorMessage).toBe("No response received from server.");
  });

  it("should return backend messages when the envelope fails", () => {
    mockQuery({ data: { status: false, data: [], messages: ["Not", "allowed"] }, isError: false, isLoading: false });

    expect(renderHook(useCategorySelectOptions).result.current.errorMessage).toBe("Not allowed");
  });

  it("should return categories on success", () => {
    const categories = [{ id: "1", category_name: "Audio" }];

    mockQuery({ data: { status: true, data: categories, messages: [] }, isError: false, isLoading: false });

    expect(renderHook(useCategorySelectOptions).result.current).toEqual({ categories, isLoading: false, errorMessage: null });
  });

  it("should format string and empty messages", () => {
    expect(_formatCategoryMessages("Bad request")).toBe("Bad request");
    expect(_formatCategoryMessages(null)).toBe("Category request failed.");
  });
});
