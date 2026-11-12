import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/services/master-category.service";

import MasterCategoryCreateContainer from "./MasterCategoryCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-category.service", () => ({
  useGetCategoryByIdQuery: jest.fn(),
  useCreateCategoryMutation: jest.fn(),
  useUpdateCategoryMutation: jest.fn(),
}));

const updateCategory = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} path - Initial route
 * @returns {void}
 */
const renderAt = (path: string): void => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/master-category" element={<p>Category list</p>} />
        <Route path="/master-category/create" element={<MasterCategoryCreateContainer />} />
        <Route path="/master-category/edit/:id" element={<MasterCategoryCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterCategoryCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetCategoryByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateCategoryMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateCategoryMutation).mockReturnValue([updateCategory, { isLoading: false }] as never);
  });

  it("should render an empty create form and skip the detail query", () => {
    renderAt("/master-category/create");

    expect(useGetCategoryByIdQuery).toHaveBeenCalledWith("", { skip: true });
    expect(screen.getByRole("button", { name: "Create Category" })).toBeInTheDocument();
  });

  it("should load the category by id and submit the update", async () => {
    jest.mocked(useGetCategoryByIdQuery).mockReturnValue({
      data: { status: true, messages: null, data: { id: "c-1", category_name: "Existing", status: 1, created_at: null } },
      isLoading: false,
      isError: false,
    } as never);

    renderAt("/master-category/edit/c-1");

    await waitFor(() => expect(screen.getByDisplayValue("Existing")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Category" }));

    await waitFor(() => expect(screen.getByText("Category list")).toBeInTheDocument());
    expect(useGetCategoryByIdQuery).toHaveBeenCalledWith("c-1", { skip: false });
    expect(updateCategory).toHaveBeenCalledWith({ id: "c-1", category_name: "Existing", status: 1 });
  });

  it("should show the load error when the category cannot be fetched", () => {
    jest.mocked(useGetCategoryByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    renderAt("/master-category/edit/c-1");

    expect(screen.getByText("Unable to load category data. Please try again.")).toBeInTheDocument();
  });
});
