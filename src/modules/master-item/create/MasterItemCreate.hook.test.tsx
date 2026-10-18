import { act, renderHook } from "@testing-library/react";
import * as Router from "react-router-dom";

import { useMasterItemCreateForm } from "./MasterItemCreate.hook";
import type { ItemRouteState } from "./MasterItemCreate.type";

import * as CategoryHook from "@/modules/master-category/MasterCategory.hook";
import * as ItemService from "@/services/master-item.service";

jest.mock("react-router-dom", () => ({ ...jest.requireActual("react-router-dom"), useNavigate: jest.fn(), useLocation: jest.fn(), useParams: jest.fn() }));
jest.mock("@/modules/master-category/MasterCategory.hook", () => ({ useCategorySelectOptions: jest.fn() }));
jest.mock("@/services/master-item.service", () => ({ useCreateItemMutation: jest.fn(), useUpdateItemMutation: jest.fn(), useUploadImageMutation: jest.fn() }));

describe("MasterItemCreate.hook", () => {
  const navigate = jest.fn();
  const createItem = jest.fn();
  const updateItem = jest.fn();
  const uploadImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
    jest.mocked(Router.useParams).mockReturnValue({});
    jest.mocked(CategoryHook.useCategorySelectOptions).mockReturnValue({ categories: [], isLoading: false, errorMessage: null });
    jest.mocked(ItemService.useCreateItemMutation).mockReturnValue([createItem, { isLoading: false }] as never);
    jest.mocked(ItemService.useUpdateItemMutation).mockReturnValue([updateItem, { isLoading: false }] as never);
    jest.mocked(ItemService.useUploadImageMutation).mockReturnValue([uploadImage, { isLoading: false }] as never);
  });

  it("should initialize create state and handle field changes", () => {
    const { result } = renderHook(() => useMasterItemCreateForm());

    expect(result.current.name).toBe("");
    expect(result.current.isActive).toBe(false);
    act(() => {
      result.current.handleNameChange({ target: { value: "Camera" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handlePriceChange({ target: { value: "Rp 100.000" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleStatusChange();
    });

    expect(result.current.name).toBe("Camera");
    expect(result.current.price).toBe("100000");
    expect(result.current.isActive).toBe(true);
  });

  it("should initialize edit state from route data", () => {
    const routeState: ItemRouteState = { item: { id: "1", name: "Camera", categoryId: "cat-1", categoryName: "Camera", price: 100000, stock: 2, image: "", duration: 3, remark: "Note", status: "active", createAt: null, createBy: null } };
    jest.mocked(Router.useParams).mockReturnValue({ id: "1" });
    jest.mocked(Router.useLocation).mockReturnValue({ state: routeState } as never);

    const { result } = renderHook(() => useMasterItemCreateForm());

    expect(result.current.isEditMode).toBe(true);
    expect(result.current.name).toBe("Camera");
    expect(result.current.isActive).toBe(true);
  });

  it("should validate before create submission", async () => {
    const { result } = renderHook(() => useMasterItemCreateForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(result.current.errorMessage).toBe("Item name is required.");
    expect(createItem).not.toHaveBeenCalled();
  });

  it("should submit create payload and navigate", async () => {
    createItem.mockReturnValue({ unwrap: () => Promise.resolve({ status: true }) });
    const { result } = renderHook(() => useMasterItemCreateForm());
    act(() => {
      result.current.handleNameChange({ target: { value: "Camera" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleCategoryChange("cat-1");
      result.current.handlePriceChange({ target: { value: "100000" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleStockChange({ target: { value: "2" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleDurationChange({ target: { value: "3" } } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(createItem).toHaveBeenCalledWith(expect.objectContaining({ name: "Camera", category_id: "cat-1", status: 1 }));
    expect(navigate).toHaveBeenCalledWith("/master-item");
  });

  it("should handle image upload failure", async () => {
    uploadImage.mockReturnValue({ unwrap: () => Promise.reject(new Error("failed")) });
    const { result } = renderHook(() => useMasterItemCreateForm());
    const file = new File(["image"], "camera.png", { type: "image/png" });

    await act(async () => {
      await result.current.handleImageChange({ target: { files: [file] } } as never);
    });

    expect(result.current.imageUploadError).toBe("Unable to upload image. Please try again.");
  });
});
