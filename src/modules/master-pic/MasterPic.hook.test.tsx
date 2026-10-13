import { renderHook, act } from "@testing-library/react";
import { useGetPicsQuery } from "./MasterPic.api";
import { useMasterPicNavigation, useMasterPicContainerState } from "./MasterPic.hook";

jest.mock("./MasterPic.api", () => ({
  useGetPicsQuery: jest.fn(),
  useCreatePicMutation: jest.fn(),
  _mapPic: (pic: { id: string; name: string; status: number; created_at: string | null; created_by: string | null }) => ({
    id: pic.id,
    name: pic.name,
    status: pic.status === 1 ? "active" : "inactive",
    createAt: pic.created_at ?? "",
    createBy: pic.created_by ?? "",
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.mocked(useGetPicsQuery).mockReturnValue({ data: undefined, error: undefined, isLoading: false } as ReturnType<typeof useGetPicsQuery>);
});

describe("MasterPic hook", () => {
  describe("useMasterPicNavigation", () => {
    it("should handle navigation correctly", () => {
      const { result } = renderHook(() => useMasterPicNavigation());

      act(() => { result.current.goBack(); });
      expect(mockNavigate).toHaveBeenCalledWith(-1);

      act(() => { result.current.goCreate(); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/create");

      act(() => { result.current.goEdit({ id: "1" } as any); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/edit/1");

      act(() => { result.current.goDetail({ id: "1" } as any); });
      expect(mockNavigate).toHaveBeenCalledWith("/master-pic/detail/1");
    });
  });

  describe("useMasterPicContainerState", () => {
    it("should manage dropdown state correctly", () => {
      const { result } = renderHook(() => useMasterPicContainerState());

      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.handleCloseMore(); });
      expect(result.current.isMoreOpen).toBe(false);

      act(() => { result.current.toggleMore(); });
      expect(result.current.isMoreOpen).toBe(true);

      act(() => { result.current.goDelete(); });
      expect(result.current.isMoreOpen).toBe(false);
    });
  });
});
