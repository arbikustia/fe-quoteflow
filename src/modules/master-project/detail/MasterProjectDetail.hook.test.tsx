import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterProjectDetail } from "./MasterProjectDetail.hook";

import * as MasterProjectService from "@/services/master-project.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/master-project.service", () => ({
  useGetProjectByIdQuery: jest.fn(),
  mapProject: jest.fn(),
}));

describe("MasterProjectDetail.hook", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "proj-1" });
  });

  it("should return mapped project when query succeeds", () => {
    const mockApiProject = {
      id: "proj-1",
      name: "Studio Redesign",
      remark: "Design room",
      status: 1,
      created_at: "2026-03-01",
      created_by: "Admin",
      items: [],
    };

    const mockProjectData = {
      id: "proj-1",
      name: "Studio Redesign",
      remark: "Design room",
      status: "active" as const,
      createAt: "2026-03-01",
      createBy: "Admin",
      items: [],
    };

    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: { status: true, data: mockApiProject },
      isLoading: false,
      error: null,
    });
    (MasterProjectService.mapProject as jest.Mock).mockReturnValue(mockProjectData);

    const { result } = renderHook(() => useMasterProjectDetail());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.project).toEqual(mockProjectData);
  });

  it("should handle error state when query encounters an error", () => {
    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { status: 500 },
    });

    const { result } = renderHook(() => useMasterProjectDetail());

    expect(result.current.errorMessage).toBe("Unable to load project detail.");
    expect(result.current.project).toBeNull();
  });

  it("should handle error message when status is false", () => {
    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: { status: false, data: null },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useMasterProjectDetail());

    expect(result.current.errorMessage).toBe("Project detail is unavailable.");
  });

  it("should trigger back navigation on goBack", () => {
    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { result } = renderHook(() => useMasterProjectDetail());

    act(() => {
      result.current.goBack();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should trigger edit navigation on goEdit with project id", () => {
    const mockProjectData = {
      id: "proj-777",
      name: "Studio",
      remark: "",
      status: "active" as const,
      createAt: "",
      createBy: "",
      items: [],
    };

    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: { status: true, data: {} },
      isLoading: false,
    });
    (MasterProjectService.mapProject as jest.Mock).mockReturnValue(mockProjectData);

    const { result } = renderHook(() => useMasterProjectDetail());

    act(() => {
      result.current.goEdit();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/master-project/edit/proj-777");
  });
});
