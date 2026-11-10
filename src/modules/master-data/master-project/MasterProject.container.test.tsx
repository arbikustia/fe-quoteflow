import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { BrowserRouter } from "react-router-dom";

import MasterProjectContainer from "./MasterProject.container";
import * as hooks from "./MasterProject.hook";
import { usePagePermission } from "@/hooks/usePagePermission";

jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: jest.fn(),
}));

jest.mock("./MasterProject.hook", () => ({
  useMasterProjectContainerState: jest.fn(),
}));

jest.mock("./MasterProject.component", () => ({
  MasterProjectComponent: jest.fn(({ onCreate, onEdit }) => (
    <div data-testid="mock-component" data-create={!!onCreate} data-edit={!!onEdit} />
  )),
}));

const mockState = {
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
  goBack: jest.fn(),
  goCreate: jest.fn(),
  goEdit: jest.fn(),
  goDetail: jest.fn(),
  goDelete: jest.fn(),
};

describe("MasterProjectContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(hooks.useMasterProjectContainerState).mockReturnValue(mockState);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false });
  });

  it("should pass create/edit when permitted", () => {
    render(
      <BrowserRouter>
        <MasterProjectContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-create")).toBe("true");
    expect(screen.getByTestId("mock-component").getAttribute("data-edit")).toBe("true");
    expect(usePagePermission).toHaveBeenCalledWith("/master-project");
  });

  it("should omit create/edit when denied", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false });

    render(
      <BrowserRouter>
        <MasterProjectContainer />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("mock-component").getAttribute("data-create")).toBe("false");
    expect(screen.getByTestId("mock-component").getAttribute("data-edit")).toBe("false");
  });
});
