import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterProjectCreate } from "./MasterProjectCreate.hook";

import * as MasterItemService from "@/services/master-item.service";
import * as MasterProjectService from "@/services/master-project.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/master-item.service", () => ({
  useGetAllItemsQuery: jest.fn(),
}));

jest.mock("@/services/master-project.service", () => ({
  useGetProjectByIdQuery: jest.fn(),
  useCreateProjectMutation: jest.fn(),
  useUpdateProjectMutation: jest.fn(),
}));

describe("MasterProjectCreate.hook", () => {
  const mockNavigate = jest.fn();
  const mockCreateProject = jest.fn();
  const mockUpdateProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({});

    (MasterItemService.useGetAllItemsQuery as jest.Mock).mockReturnValue({
      data: {
        status: true,
        data: [
          { id: "item-1", name: "Camera", image: "", price: 1000, stock: 5 },
          { id: "item-2", name: "Tripod", image: "", price: 500, stock: 2 },
        ],
      },
      isLoading: false,
      error: null,
    });

    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    (MasterProjectService.useCreateProjectMutation as jest.Mock).mockReturnValue([
      mockCreateProject,
      { isLoading: false },
    ]);

    (MasterProjectService.useUpdateProjectMutation as jest.Mock).mockReturnValue([
      mockUpdateProject,
      { isLoading: false },
    ]);
  });

  it("should initialize with default step and empty fields", () => {
    const { result } = renderHook(() => useMasterProjectCreate());

    expect(result.current.step).toBe(1);
    expect(result.current.name).toBe("");
    expect(result.current.remark).toBe("");
    expect(result.current.selectedItems).toEqual([]);
    expect(result.current.items.length).toBe(2);
  });

  it("should toggle items and update quantities", () => {
    const { result } = renderHook(() => useMasterProjectCreate());
    const item = result.current.items[0];

    act(() => {
      result.current.toggleItem(item);
    });

    expect(result.current.selectedItems).toEqual([{ ...item, qty: 1 }]);

    act(() => {
      result.current.updateItemQuantity(item.id, 3);
    });

    expect(result.current.selectedItems[0].qty).toBe(3);

    act(() => {
      result.current.toggleItem(item);
    });

    expect(result.current.selectedItems).toEqual([]);
  });

  it("should validate and control wizard steps", () => {
    const { result } = renderHook(() => useMasterProjectCreate());

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.errorMessage).toBe("Select at least one item.");
    expect(result.current.step).toBe(1);

    act(() => {
      result.current.toggleItem(result.current.items[0]);
    });
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.errorMessage).toBe("Project name is required.");
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.handleNameChange({
        target: { value: "New Studio Project" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe(3);

    act(() => {
      result.current.previousStep();
    });
    expect(result.current.step).toBe(2);
  });

  it("should handle navigation goBack", () => {
    const { result } = renderHook(() => useMasterProjectCreate());

    act(() => {
      result.current.goBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should submit create project successfully", async () => {
    mockCreateProject.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true }),
    });

    const { result } = renderHook(() => useMasterProjectCreate());

    act(() => {
      result.current.toggleItem(result.current.items[0]);
      result.current.handleNameChange({
        target: { value: "Project Alpha" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Step 1 -> Step 2
    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });
    expect(result.current.step).toBe(2);

    // Step 2 -> Step 3
    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });
    expect(result.current.step).toBe(3);

    // Step 3 -> submit to API
    await act(async () => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockCreateProject).toHaveBeenCalledWith({
      name: "Project Alpha",
      remark: "",
      status: 1,
      items: [{ item_id: "item-1", qty: 1 }],
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-project");
  });

  it("should load existing project in edit mode", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "proj-123" });
    (MasterProjectService.useGetProjectByIdQuery as jest.Mock).mockReturnValue({
      data: {
        status: true,
        data: {
          id: "proj-123",
          name: "Existing Project",
          remark: "Existing Remark",
          items: [{ item_id: "item-1", qty: 2 }],
        },
      },
      isLoading: false,
    });

    const { result } = renderHook(() => useMasterProjectCreate());

    expect(result.current.name).toBe("Existing Project");
    expect(result.current.remark).toBe("Existing Remark");
    expect(result.current.selectedItems).toEqual([
      { id: "item-1", name: "Camera", image: "", price: 1000, stock: 5, qty: 2 },
    ]);
  });
});
