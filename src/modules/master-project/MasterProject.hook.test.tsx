import { act, renderHook } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import type { ProjectData } from "./MasterProject.type";
import { useMasterProjectContainerState, useMasterProjectNavigation } from "./MasterProject.hook";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock("@/services/master-project.service", () => {
  const actual = jest.requireActual("@/services/master-project.service");
  return {
    ...actual,
    useGetProjectsQuery: jest.fn(),
  };
});

const mockNavigate = jest.fn();

describe("MasterProject Navigation Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require("react-router-dom").useNavigate as ReturnType<typeof jest.fn>).mockReturnValue(mockNavigate);
  });

  it("should provide navigation functions", () => {
    const { result } = renderHook(() => useMasterProjectNavigation(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("goBack");
    expect(result.current).toHaveProperty("goCreate");
    expect(result.current).toHaveProperty("goEdit");
    expect(result.current).toHaveProperty("goDetail");
  });

  it("should trigger correct navigation paths", () => {
    const { result } = renderHook(() => useMasterProjectNavigation(), { wrapper: MemoryRouter });

    act(() => result.current.goBack());
    expect(mockNavigate).toHaveBeenCalledWith(-1);

    act(() => result.current.goCreate());
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/create");

    const editProject: ProjectData = {
      id: "1",
      name: "Edit project",
      remark: "",
      status: "active",
      createAt: "",
      createBy: "",
      items: [],
    };
    const detailProject: ProjectData = { ...editProject, id: "2" };

    act(() => result.current.goEdit(editProject));
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/edit/1");

    act(() => result.current.goDetail(detailProject));
    expect(mockNavigate).toHaveBeenCalledWith("/master-project/detail/2");
  });
});

describe("MasterProject Pagination Hook", () => {
  const mockUseGetProjectsQuery = require("@/services/master-project.service").useGetProjectsQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loading state when query is loading", () => {
    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
      error: undefined,
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.isMissingData).toBe(false);
    expect(result.current.paginatedData).toEqual([]);
  });

  it("should return error state when query has error", () => {
    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      error: { status: 500, data: "Server Error" },
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe("Unable to load projects.");
    expect(result.current.isMissingData).toBe(false);
    expect(result.current.paginatedData).toEqual([]);
  });

  it("should return missing response state when data is undefined", () => {
    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      error: undefined,
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe("No response received from server.");
    expect(result.current.isMissingData).toBe(true);
    expect(result.current.paginatedData).toEqual([]);
  });

  it("should return missing payload state when data.data is undefined", () => {
    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: { data: undefined, total_pages: 0, total_count: 0, has_next: false, has_previous: false, page_number: 1 },
      error: undefined,
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe("Response is missing data payload.");
    expect(result.current.isMissingData).toBe(true);
    expect(result.current.paginatedData).toEqual([]);
  });

  it("should return success state with mapped projects", () => {
    const mockProjects = [
      { id: "P001", name: "Project 1", remark: "Test remark", status: 1, created_at: "2024-01-01", created_by: "User 1" },
      { id: "P002", name: "Project 2", remark: null, status: 2, created_at: "2024-01-02", created_by: "User 2" },
    ];

    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: {
        data: mockProjects,
        total_pages: 1,
        total_count: 2,
        has_next: false,
        has_previous: false,
        page_number: 1,
      },
      error: undefined,
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.isMissingData).toBe(false);
    expect(result.current.paginatedData).toHaveLength(2);
    expect(result.current.paginatedData[0]).toEqual({
      id: "P001",
      name: "Project 1",
      remark: "Test remark",
      status: "active",
      createAt: "2024-01-01",
      createBy: "User 1",
      items: [],
    });
    expect(result.current.paginatedData[1]).toEqual({
      id: "P002",
      name: "Project 2",
      remark: "",
      status: "inactive",
      createAt: "2024-01-02",
      createBy: "User 2",
      items: [],
    });
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalCount).toBe(2);
  });

  it("should handle pagination controls", () => {
    const mockProjects = [
      { id: "P001", name: "Project 1", remark: "Test", status: 1, created_at: "2024-01-01", created_by: "User 1" },
    ];

    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: {
        data: mockProjects,
        total_pages: 2,
        total_count: 10,
        has_next: true,
        has_previous: false,
        page_number: 1,
      },
      error: undefined,
    });

    const { result } = renderHook(() => require("./MasterProject.hook").useMasterProjectPagination(), {
      wrapper: MemoryRouter,
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.has_next).toBeUndefined(); // Not exposed

    act(() => result.current.goToPage(2));
    expect(result.current.currentPage).toBe(2);

    act(() => result.current.nextPage());
    // nextPage only goes if has_next is true
  });
});

describe("MasterProject Container State Hook", () => {
  const mockUseGetProjectsQuery = require("@/services/master-project.service").useGetProjectsQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetProjectsQuery.mockReturnValue({
      isLoading: false,
      data: {
        data: [],
        total_pages: 1,
        total_count: 0,
        has_next: false,
        has_previous: false,
        page_number: 1,
      },
      error: undefined,
    });
  });

  it("should provide container state", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    expect(result.current).toHaveProperty("pagination");
    expect(result.current.pagination).toHaveProperty("paginatedData");
    expect(result.current).toHaveProperty("isMoreOpen");
  });

  it("should toggle more menu", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    expect(result.current.isMoreOpen).toBe(false);

    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
  });

  it("should handle delete action", () => {
    const { result } = renderHook(() => useMasterProjectContainerState(), { wrapper: MemoryRouter });
    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);

    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);
  });
});

describe("_mapProject function", () => {
  it("should map API project to UI model correctly", () => {
    const { mapProject } = require("@/services/master-project.service");

    const apiProject = {
      id: "P001",
      name: "Test Project",
      remark: "Project remark",
      status: 1,
      created_at: "2024-01-01T00:00:00Z",
      created_by: "Admin",
    };

    const mapped = mapProject(apiProject);

    expect(mapped).toEqual({
      id: "P001",
      name: "Test Project",
      remark: "Project remark",
      status: "active",
      createAt: "2024-01-01T00:00:00Z",
      createBy: "Admin",
      items: [],
    });
  });

  it("should map inactive status correctly", () => {
    const { mapProject } = require("@/services/master-project.service");

    const apiProject = {
      id: "P002",
      name: "Inactive Project",
      remark: null,
      status: 2,
      created_at: null,
      created_by: null,
    };

    const mapped = mapProject(apiProject);

    expect(mapped).toEqual({
      id: "P002",
      name: "Inactive Project",
      remark: "",
      status: "inactive",
      createAt: "",
      createBy: "",
      items: [],
    });
  });
});