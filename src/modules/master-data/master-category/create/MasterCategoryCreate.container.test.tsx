import type { InitialEntry } from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/master-category.service";

import MasterCategoryCreateContainer from "./MasterCategoryCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-category.service", () => ({
  useCreateCategoryMutation: jest.fn(),
  useUpdateCategoryMutation: jest.fn(),
}));

const updateCategory = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {InitialEntry} entry - Initial route, with optional router state
 * @returns {void}
 */
const renderAt = (entry: InitialEntry): void => {
  render(
    <MemoryRouter initialEntries={[entry]}>
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
    jest.mocked(useCreateCategoryMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateCategoryMutation).mockReturnValue([updateCategory, { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-category/create");

    expect(screen.getByRole("button", { name: "Create Category" })).toBeInTheDocument();
  });

  it("should load the category from router state and submit the update", async () => {
    renderAt({
      pathname: "/master-category/edit/c-1",
      state: { category: { id: "c-1", categoryName: "Existing", status: "active", createdAt: "-" } },
    });

    await waitFor(() => expect(screen.getByDisplayValue("Existing")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Category" }));

    await waitFor(() => expect(screen.getByText("Category list")).toBeInTheDocument());
    expect(updateCategory).toHaveBeenCalledWith({ id: "c-1", category_name: "Existing", status: 1 });
  });

  it("should ask to reopen from the list when the edit page has no router state", () => {
    renderAt("/master-category/edit/c-1");

    expect(screen.getByText("Category data is unavailable. Open the category from the category list to edit it.")).toBeInTheDocument();
  });
});
