import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { BrowserRouter } from "react-router-dom";

import { render, screen } from "@/libs/unit-test";

import MasterCategoryContainer from "./MasterCategory.container";
import * as hooks from "./MasterCategory.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn(),
}));

jest.mock("./MasterCategory.hook", () => ({
  useMasterCategoryNavigation: jest.fn(),
  useMasterCategoryContainerState: jest.fn(),
}));

jest.mock("./MasterCategory.component", () => ({
  MasterCategoryComponent: jest.fn(({ onCreate, onEdit }) => (
    <div data-testid="mock-component" data-create={!!onCreate} data-edit={!!onEdit} />
  )),
}));

describe("MasterCategory Container", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render component with hook state", () => {
    jest.mocked(hooks.useMasterCategoryNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
    });

    jest.mocked(hooks.useMasterCategoryContainerState).mockReturnValue({
      pagination: {
        currentPage: 1,
        totalPages: 2,
        pageSize: 10,
        paginatedData: [],
        totalCount: 0,
        isLoading: false,
        errorMessage: null,
        isEmpty: true,
        isMissingData: false,
        goToPage: jest.fn(),
        nextPage: jest.fn(),
        prevPage: jest.fn(),
        changePageSize: jest.fn(),
        setSearchTerm: jest.fn(),
      },
      isMoreOpen: false,
      toggleMore: jest.fn(),
      handleCloseMore: jest.fn(),
      goDelete: jest.fn(),
    });

    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false });

    render(
      <BrowserRouter>
        <MasterCategoryContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-create")).toBe("false");
    expect(screen.getByTestId("mock-component").getAttribute("data-edit")).toBe("false");
    expect(usePagePermission).toHaveBeenCalledWith("/master-category");
  });

  it("should pass create/edit when permitted", () => {
    jest.mocked(hooks.useMasterCategoryNavigation).mockReturnValue({
      goBack: jest.fn(),
      goCreate: jest.fn(),
      goEdit: jest.fn(),
    });
    jest.mocked(hooks.useMasterCategoryContainerState).mockReturnValue({
      pagination: {
        currentPage: 1,
        totalPages: 2,
        pageSize: 10,
        paginatedData: [],
        totalCount: 0,
        isLoading: false,
        errorMessage: null,
        isEmpty: true,
        isMissingData: false,
        goToPage: jest.fn(),
        nextPage: jest.fn(),
        prevPage: jest.fn(),
        changePageSize: jest.fn(),
        setSearchTerm: jest.fn(),
      },
      isMoreOpen: false,
      toggleMore: jest.fn(),
      handleCloseMore: jest.fn(),
      goDelete: jest.fn(),
    });
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false });

    render(
      <BrowserRouter>
        <MasterCategoryContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-create")).toBe("true");
    expect(screen.getByTestId("mock-component").getAttribute("data-edit")).toBe("true");
  });
});
