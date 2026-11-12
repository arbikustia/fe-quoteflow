import { MemoryRouter } from "react-router-dom";

import { MOCK_CATEGORY_LIST_RESPONSE } from "@/fixture/master-category";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetCategoriesQuery } from "@/services/master-category.service";

import MasterCategoryContainer from "./MasterCategory.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/master-category.service", () => ({ useGetCategoriesQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-category", state: { successMessage } }]}>
      <MasterCategoryContainer />
    </MemoryRouter>,
  );
};

describe("MasterCategoryContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetCategoriesQuery).mockReturnValue({ data: MOCK_CATEGORY_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized categories", () => {
    renderContainer();

    expect(useGetCategoriesQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-category");
    expect(screen.getAllByText("Lighting System")).toHaveLength(2);
    expect(screen.getAllByText("-")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Category" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: "Edit category" })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Category updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Category updated successfully.");
  });
});
