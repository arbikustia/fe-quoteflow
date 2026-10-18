import { act, renderHook } from "@testing-library/react";
import * as ReactRouterDom from "react-router-dom";

import { useMasterServiceTypeCreateForm } from "./MasterServiceTypeCreate.hook";

import * as MasterServiceTypeService from "@/services/master-service-type.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@/services/master-service-type.service", () => ({
  useCreateServiceTypeMutation: jest.fn(),
  useUpdateServiceTypeMutation: jest.fn(),
}));

describe("MasterServiceTypeCreate.hook", () => {
  const mockNavigate = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (ReactRouterDom.useLocation as jest.Mock).mockReturnValue({ state: null });
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({});

    (MasterServiceTypeService.useCreateServiceTypeMutation as jest.Mock).mockReturnValue([
      mockCreate,
      { isLoading: false },
    ]);
    (MasterServiceTypeService.useUpdateServiceTypeMutation as jest.Mock).mockReturnValue([
      mockUpdate,
      { isLoading: false },
    ]);
  });

  it("should initialize default create state", () => {
    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    expect(result.current.serviceName).toBe("");
    expect(result.current.price).toBe("");
    expect(result.current.isActive).toBe(true);
    expect(result.current.isEditMode).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  it("should initialize with route data in edit mode", () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-1" });
    (ReactRouterDom.useLocation as jest.Mock).mockReturnValue({
      state: {
        serviceType: {
          id: "st-1",
          name: "Video Editing",
          price: 750000,
          status: "inactive",
        },
      },
    });

    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    expect(result.current.serviceName).toBe("Video Editing");
    expect(result.current.price).toBe("750000");
    expect(result.current.isActive).toBe(false);
    expect(result.current.isEditMode).toBe(true);
  });

  it("should handle input changes and status toggle", () => {
    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    act(() => {
      result.current.handleServiceNameChange({
        target: { value: "Sound Mixing" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.serviceName).toBe("Sound Mixing");

    act(() => {
      result.current.handlePriceChange({
        target: { value: "Rp 150.000" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.price).toBe("150000");

    act(() => {
      result.current.handleStatusChange();
    });
    expect(result.current.isActive).toBe(false);
  });

  it("should navigate back on goBack", () => {
    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    act(() => {
      result.current.goBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("should submit create mutation and navigate to list", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true }),
    });

    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    act(() => {
      result.current.handleServiceNameChange({
        target: { value: "Color Grading" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handlePriceChange({
        target: { value: "500000" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Color Grading",
      price: 500000,
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-service-type");
  });

  it("should submit update mutation when in edit mode", async () => {
    (ReactRouterDom.useParams as jest.Mock).mockReturnValue({ id: "st-88" });
    mockUpdate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: true }),
    });

    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    act(() => {
      result.current.handleServiceNameChange({
        target: { value: "Updated Service" },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handlePriceChange({
        target: { value: "200000" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      id: "st-88",
      name: "Updated Service",
      price: 200000,
      status: 1,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/master-service-type");
  });

  it("should display backend error message when mutation returns status false", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.resolve({ status: false, messages: "Service name already exists." }),
    });

    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.errorMessage).toBe("Service name already exists.");
  });

  it("should handle submission exceptions", async () => {
    mockCreate.mockReturnValue({
      unwrap: () => Promise.reject(new Error("Network failed")),
    });

    const { result } = renderHook(() => useMasterServiceTypeCreateForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.SyntheticEvent);
    });

    expect(result.current.errorMessage).toBe("Unable to save service type. Please try again.");
  });
});
