import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { act, renderHook, waitFor } from "@/libs/unit-test";

import { useMasterOrderTypeCreate } from "./MasterOrderTypeCreate.hook";

import * as Router from "react-router-dom";
import * as OrderTypeService from "@/services/master-order-type.service";

jest.mock("react-router-dom", () => ({ useLocation: jest.fn(), useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/master-order-type.service", () => ({
  useCreateOrderTypeMutation: jest.fn(),
  useGetOrderTypeByIdQuery: jest.fn(),
  useUpdateOrderTypeMutation: jest.fn(),
}));

describe("useMasterOrderTypeCreate", (): void => {
  const createOrderType = jest.fn();
  const updateOrderType = jest.fn();
  const navigate = jest.fn<Router.NavigateFunction>();

  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate as never);
    jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
    jest.mocked(Router.useParams).mockReturnValue({});
    jest.mocked(OrderTypeService.useCreateOrderTypeMutation).mockReturnValue([createOrderType, { isLoading: false }] as never);
    jest.mocked(OrderTypeService.useUpdateOrderTypeMutation).mockReturnValue([updateOrderType, { isLoading: false }] as never);
    jest.mocked(OrderTypeService.useGetOrderTypeByIdQuery).mockReturnValue({ data: undefined, isLoading: false } as never);
  });

  it("should prevent submission when name is empty", async (): Promise<void> => {
    const { result } = renderHook(() => useMasterOrderTypeCreate());

    await act(async (): Promise<void> => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(result.current.isSubmitted).toBe(true);
    expect(createOrderType).not.toHaveBeenCalled();
  });

  it("should create order type and navigate on successful submission", async (): Promise<void> => {
    createOrderType.mockReturnValue({
      unwrap: (): Promise<{ status: boolean; messages: null; data: null }> =>
        Promise.resolve({ status: true, messages: null, data: null }),
    });
    const { result } = renderHook(() => useMasterOrderTypeCreate());

    act((): void => {
      result.current.handleNameChange({ target: { value: "Rental" } } as never);
      result.current.handleHandoverChange();
    });

    await act(async (): Promise<void> => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(createOrderType).toHaveBeenCalledWith({
      name: "Rental",
      is_handover: true,
      status: 1,
    });
    expect(result.current.successMessage).toBe("Order type created successfully.");
  });

  it("should show message when API rejects order type creation", async (): Promise<void> => {
    createOrderType.mockReturnValue({
      unwrap: (): Promise<{ status: boolean; messages: string[]; data: null }> =>
        Promise.resolve({ status: false, messages: ["Duplicate order type name"], data: null }),
    });
    const { result } = renderHook(() => useMasterOrderTypeCreate());

    act((): void => {
      result.current.handleNameChange({ target: { value: "Rental" } } as never);
    });

    await act(async (): Promise<void> => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    await waitFor((): void => expect(result.current.errorMessage).toBe("Duplicate order type name"));
  });

  it("should initialize edit values and submit update payload", async (): Promise<void> => {
    jest.mocked(Router.useParams).mockReturnValue({ id: "order-type-1" });
    jest.mocked(OrderTypeService.useGetOrderTypeByIdQuery).mockReturnValue({
      data: {
        status: true,
        messages: null,
        data: {
          id: "order-type-1",
          name: "Project",
          is_handover: false,
          status: 1,
          created_at: null,
          updated_at: null,
        },
      },
      isLoading: false,
    } as never);
    updateOrderType.mockReturnValue({
      unwrap: (): Promise<{ status: boolean; messages: null; data: null }> =>
        Promise.resolve({ status: true, messages: null, data: null }),
    });
    const { result } = renderHook(() => useMasterOrderTypeCreate());

    await waitFor((): void => expect(result.current.name).toBe("Project"));
    expect(result.current.isEditMode).toBe(true);

    act((): void => {
      result.current.handleHandoverChange();
      result.current.handleStatusChange();
    });

    await act(async (): Promise<void> => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    expect(updateOrderType).toHaveBeenCalledWith({
      id: "order-type-1",
      name: "Project",
      is_handover: true,
      status: 0,
    });
  });
});
