import type { InitialEntry } from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_API_ITEMS } from "@/fixture/master-item";
import { useCategorySelectOptions } from "@/hooks/useCategorySelectOptions";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateItemMutation, useUpdateItemMutation, useUploadImageMutation } from "@/services/master-item.service";

import MasterItemCreateContainer from "./MasterItemCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/hooks/useCategorySelectOptions", () => ({ useCategorySelectOptions: jest.fn() }));
jest.mock("@/services/master-item.service", () => ({
  useCreateItemMutation: jest.fn(),
  useUpdateItemMutation: jest.fn(),
  useUploadImageMutation: jest.fn(),
}));

const updateItem = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {InitialEntry} entry - Initial route, with optional router state
 * @returns {void}
 */
const renderAt = (entry: InitialEntry): void => {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/master-item" element={<p>Item list</p>} />
        <Route path="/master-item/create" element={<MasterItemCreateContainer />} />
        <Route path="/master-item/edit/:id" element={<MasterItemCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterItemCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCategorySelectOptions).mockReturnValue({ categories: [{ id: "category-1", category_name: "Lighting Equipment" }], isLoading: false, errorMessage: null });
    jest.mocked(useCreateItemMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateItemMutation).mockReturnValue([updateItem, { isLoading: false }] as never);
    jest.mocked(useUploadImageMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  });

  it("should render an empty create form", () => {
    renderAt("/master-item/create");

    expect(screen.getByRole("button", { name: "Create Item" })).toBeInTheDocument();
  });

  it("should load the item from router state and submit the update", async () => {
    renderAt({ pathname: "/master-item/edit/item-1", state: { item: MOCK_API_ITEMS[0] } });

    await waitFor(() => expect(screen.getByDisplayValue("Beam 290")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Item" }));

    await waitFor(() => expect(screen.getByText("Item list")).toBeInTheDocument());
    expect(updateItem).toHaveBeenCalledWith({
      id: "item-1",
      name: "Beam 290",
      category_id: "category-1",
      price: 100000,
      stock: 11,
      image: "https://cdn.example.com/api/image/beam-290.jpg",
      duration: 1,
      remark: "Lighting",
      status: 1,
    });
  });

  it("should show the category load error", () => {
    jest.mocked(useCategorySelectOptions).mockReturnValue({ categories: [], isLoading: false, errorMessage: "Unable to load categories." });

    renderAt("/master-item/create");

    expect(screen.getByText("Unable to load categories.")).toBeInTheDocument();
  });

  it("should ask to reopen from the list when the edit page has no router state", () => {
    renderAt("/master-item/edit/item-1");

    expect(screen.getByText("Item data is unavailable. Open the item from the item list to edit it.")).toBeInTheDocument();
  });
});
