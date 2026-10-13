import { act, render, screen } from "@testing-library/react";
import type * as React from "react";
import { BrowserRouter } from "react-router-dom";

import { useGetCategoriesQuery } from "./MasterCategory.api";
import MasterCategoryContainer from "./MasterCategory.container";
import type { MasterCategoryProps } from "./MasterCategory.type";

const mockComponentProps: MasterCategoryProps[] = [];

jest.mock("./MasterCategory.api", () => ({
  useGetCategoriesQuery: jest.fn(),
  useCreateCategoryMutation: jest.fn(),
  _mapCategory: (category: { readonly id: string; readonly name: string; readonly status: number; readonly created_at: string | null; readonly created_by: string | null }) => ({
    id: category.id,
    categoryName: category.name,
    status: category.status === 1 ? "active" : "inactive",
    createAt: category.created_at ?? "",
    createBy: category.created_by ?? "",
  }),
}));

jest.mock("./MasterCategory.component", () => ({
  MasterCategoryComponent: (props: MasterCategoryProps): React.ReactElement => {
    mockComponentProps.push(props);

    return <div data-testid="mock-component" />;
  },
}));

const mockQueryResult = {
  data: {
    status: true,
    messages: null,
    data: {
      data: [
        {
          id: "1",
          name: "Audio System",
          status: 1,
          created_at: "2024-01-15 10:30",
          created_by: "Admin",
        },
      ],
      page_number: 1,
      total_pages: 2,
      page_size: 10,
      total_count: 11,
      has_previous: false,
      has_next: true,
    },
  },
  error: undefined,
  isLoading: false,
};

const _renderContainer = (): void => {
  render(
    <BrowserRouter>
      <MasterCategoryContainer />
    </BrowserRouter>,
  );
};

describe("MasterCategory Container", () => {
  beforeEach(() => {
    mockComponentProps.length = 0;
    jest.mocked(useGetCategoriesQuery).mockReturnValue(mockQueryResult as never);
  });

  it("should render component while query resolves from API", () => {
    _renderContainer();

    expect(screen.getByTestId("mock-component")).toBeInTheDocument();
    expect(useGetCategoriesQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
  });

  it("should refetch with search term when search term changes", () => {
    _renderContainer();
    act(() => { mockComponentProps[0].setSearchTerm("audio"); });

    expect(useGetCategoriesQuery).toHaveBeenLastCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "audio" });
  });
});
