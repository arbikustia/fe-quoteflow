import { act, renderHook } from "@/libs/unit-test";

import { useOrderCreateLogic } from "./OrderCreate.hook";

import * as Router from "react-router-dom";
import * as ActivityLogService from "@/services/activity-log.service";
import * as CustomerService from "@/services/master-customer.service";
import * as ItemService from "@/services/master-item.service";
import * as PicService from "@/services/master-pic.service";
import * as ProjectService from "@/services/master-project.service";
import * as ServiceTypeService from "@/services/master-service-type.service";
import * as VoucherService from "@/services/master-voucher.service";
import * as OrderService from "@/services/order.service";
import * as QuotationService from "@/services/quotation.service";

jest.mock("react-router-dom", () => ({ useLocation: jest.fn(), useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/activity-log.service", () => ({ useCreateActivityLogMutation: jest.fn() }));
jest.mock("@/services/master-customer.service", () => ({ useGetAllCustomersQuery: jest.fn() }));
jest.mock("@/services/master-item.service", () => ({ useGetAllItemsQuery: jest.fn() }));
jest.mock("@/services/master-pic.service", () => ({ useGetAllPicsQuery: jest.fn() }));
jest.mock("@/services/master-project.service", () => ({ useGetAllProjectsQuery: jest.fn() }));
jest.mock("@/services/master-service-type.service", () => ({ useGetAllServiceTypesQuery: jest.fn() }));
jest.mock("@/services/master-voucher.service", () => ({ useGetAllVouchersQuery: jest.fn(), useGetVoucherByCodeQuery: jest.fn() }));
jest.mock("@/services/order.service", () => ({
  useCreateOrderMutation: jest.fn(),
  useCreateProjectOrderMutation: jest.fn(),
  useGetAllOrderTypesQuery: jest.fn(),
  useGetOrderByIdQuery: jest.fn(),
  useUpdateOrderMutation: jest.fn(),
}));
jest.mock("@/services/quotation.service", () => ({ useGetQuotationByIdQuery: jest.fn() }));

const navigate = jest.fn();
const createOrder = jest.fn();
const refetch = jest.fn();

/**
 * Build an RTK query result with data.
 * @param {unknown[]} data - Rows of the query
 * @returns {never} - Query result
 */
const query = (data: unknown[]): never => ({ data: { status: true, data }, isLoading: false, refetch }) as never;

/**
 * Mock every service hook the form uses.
 * @returns {void} - No return value
 */
const mockServices = (): void => {
  jest.mocked(Router.useNavigate).mockReturnValue(navigate);
  jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
  jest.mocked(Router.useParams).mockReturnValue({});
  jest.mocked(CustomerService.useGetAllCustomersQuery).mockReturnValue(query([{ id: "c1", name: "Acme", phone_number: "0812", address: "Jakarta" }]));
  jest.mocked(PicService.useGetAllPicsQuery).mockReturnValue(query([{ id: "p1", name: "Pic" }]));
  jest.mocked(ServiceTypeService.useGetAllServiceTypesQuery).mockReturnValue(query([{ id: "s1", name: "RENTAL" }]));
  jest.mocked(ItemService.useGetAllItemsQuery).mockReturnValue(query([{ id: "i1", name: "Camera", image: null, price: 100, stock: 5 }]));
  jest.mocked(ProjectService.useGetAllProjectsQuery).mockReturnValue(query([]));
  jest.mocked(VoucherService.useGetAllVouchersQuery).mockReturnValue(query([{ id: "v1", name: "Promo", discount_percent: 10 }]));
  jest.mocked(VoucherService.useGetVoucherByCodeQuery).mockReturnValue({ data: undefined } as never);
  jest.mocked(OrderService.useGetAllOrderTypesQuery).mockReturnValue(query([{ id: "o1", name: "Delivery", is_handover: false }]));
  jest.mocked(OrderService.useGetOrderByIdQuery).mockReturnValue({ data: undefined } as never);
  jest.mocked(OrderService.useCreateOrderMutation).mockReturnValue([createOrder, { isLoading: false }] as never);
  jest.mocked(OrderService.useCreateProjectOrderMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  jest.mocked(OrderService.useUpdateOrderMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  jest.mocked(ActivityLogService.useCreateActivityLogMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
  jest.mocked(QuotationService.useGetQuotationByIdQuery).mockReturnValue({ data: undefined } as never);
};

describe("useOrderCreateLogic", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    mockServices();
  });

  it("should expose select options and block the next step while information is incomplete", (): void => {
    const { result } = renderHook(() => useOrderCreateLogic());

    expect(result.current.customers).toHaveLength(1);
    expect(result.current.isEdit).toBe(false);

    act((): void => result.current.onNextStep());

    expect(result.current.step).toBe(1);
    expect(result.current.showInformationErrors).toBe(true);
    expect(result.current.errorMessage).toBe("Please complete all required Order Information fields.");
  });

  it("should fill the form from selections, advance to the item step and go back", (): void => {
    const { result } = renderHook(() => useOrderCreateLogic());

    act((): void => {
      result.current.onCustomerChange("c1");
      result.current.onPicChange("p1");
      result.current.onServiceTypeChange("s1");
      result.current.onOrderTypeChange("o1");
      result.current.onChange("event_name", "Annual Meeting");
      result.current.onVoucherChange("v1");
    });
    act((): void => result.current.onNextStep());

    expect(result.current.form.customer_name).toBe("Acme");
    expect(result.current.form.discount).toBe(10);
    expect(result.current.step).toBe(2);

    act((): void => result.current.onNextStep());
    expect(result.current.errorMessage).toBe("Please select at least one item.");

    act((): void => result.current.onPreviousStep());
    expect(result.current.step).toBe(1);

    act((): void => result.current.onBack());
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("should refetch vouchers when the voucher search is cleared", (): void => {
    const { result } = renderHook(() => useOrderCreateLogic());

    act((): void => result.current.onVoucherSearch("PROMO"));
    act((): void => result.current.onVoucherSearch(""));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("should populate the form once when editing an order", (): void => {
    jest.mocked(Router.useParams).mockReturnValue({ id: "order-1" });
    jest.mocked(OrderService.useGetOrderByIdQuery).mockReturnValue({
      data: { status: true, data: { id: "order-1", event_name: "Edited", rental_transaction_items: [], rental_transaction_project: [] } },
    } as never);

    const { result } = renderHook(() => useOrderCreateLogic());

    expect(result.current.isEdit).toBe(true);
    expect(result.current.form.event_name).toBe("Edited");
  });

  it("should submit the order and report failures", async (): Promise<void> => {
    createOrder.mockReturnValue({ unwrap: jest.fn().mockRejectedValue(new Error("boom")) });
    const { result } = renderHook(() => useOrderCreateLogic());
    const event = { preventDefault: jest.fn() } as never;

    await act(async (): Promise<void> => result.current.onSubmit(event));

    expect(result.current.errorMessage).toBe("Unable to save order: boom");

    act((): void => result.current.onPreventSubmit({ preventDefault: jest.fn() } as never));
  });
});
