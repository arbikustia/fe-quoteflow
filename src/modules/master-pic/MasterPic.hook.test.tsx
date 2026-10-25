import { act, renderHook } from "@/libs/unit-test";

import { useGetPicsQuery } from "@/services/master-pic.service";

import { useMasterPicContainerState, useMasterPicNavigation } from "./MasterPic.hook";
import type { PicData } from "./MasterPic.type";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("@/services/master-pic.service", () => ({
  mapPic: jest.fn((pic: PicData) => pic),
  useGetPicsQuery: jest.fn(() => ({ data: { data: [], total_count: 0, total_pages: 1 }, isLoading: false, isError: false })),
}));

const mockPic: PicData = { id: "1", name: "PIC 1", status: "active", createAt: null, createBy: null };

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useGetPicsQuery).mockReturnValue({
    data: { status: true, messages: null, data: [], page_number: 1, page_size: 10, total_pages: 1, total_count: 0, has_previous: false, has_next: false },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  });
});

describe("MasterPic hook", () => {
  it("should handle navigation correctly", () => {
    const { result } = renderHook(() => useMasterPicNavigation());

    act(() => result.current.goBack());
    act(() => result.current.goCreate());
    act(() => result.current.goEdit(mockPic));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    expect(mockNavigate).toHaveBeenNthCalledWith(2, "/master-pic/create");
    expect(mockNavigate).toHaveBeenNthCalledWith(3, "/master-pic/edit/1", { state: { pic: mockPic } });
  });

  it("should manage dropdown state correctly", () => {
    const { result } = renderHook(() => useMasterPicContainerState());

    expect(result.current.isMoreOpen).toBe(false);
    act(() => result.current.toggleMore());
    expect(result.current.isMoreOpen).toBe(true);
    act(() => result.current.handleCloseMore());
    expect(result.current.isMoreOpen).toBe(false);
    act(() => result.current.toggleMore());
    act(() => result.current.goDelete());
    expect(result.current.isMoreOpen).toBe(false);
  });
});
