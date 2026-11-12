import { act, renderHook } from "@/libs/unit-test";

import { usePaymentCreate } from "./PaymentCreate.hook";

import * as Router from "react-router-dom";
import * as PaymentService from "@/services/payment.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useLocation: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/payment.service", () => ({
  useCreatePaymentMutation: jest.fn(),
  useUpdatePaymentMutation: jest.fn(),
  useGetAllInvoicesQuery: jest.fn(),
  useGetAllPaymentMethodsQuery: jest.fn(),
  useGetPaymentsQuery: jest.fn(),
}));

const navigate = jest.fn();
const create = jest.fn();
const update = jest.fn();
const submitEvent = { preventDefault: jest.fn() } as never;
const routePayment = { invoiceId: "i1", paymentMethodId: "pm1", status: "active", paymentStatus: 1, amount: 1000, paidAt: "2026-11-01T08:00:00.000Z", referenceNo: "R1", notes: "n" };

/**
 * Mock the route params and location state.
 * @param {string | undefined} id - Route payment ID
 * @param {object | null} state - Location state
 * @returns {void} - Nothing
 */
const mockRoute = (id: string | undefined, state: object | null): void => {
  jest.mocked(Router.useParams).mockReturnValue({ id });
  jest.mocked(Router.useLocation).mockReturnValue({ state } as never);
};

describe("usePaymentCreate", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(PaymentService.useCreatePaymentMutation).mockReturnValue([create, { isLoading: false }] as never);
    jest.mocked(PaymentService.useUpdatePaymentMutation).mockReturnValue([update, { isLoading: false }] as never);
    jest.mocked(PaymentService.useGetAllPaymentMethodsQuery).mockReturnValue({ data: { status: true, data: [{ id: "pm1", name: "BCA" }] }, isLoading: false } as never);
    jest.mocked(PaymentService.useGetAllInvoicesQuery).mockReturnValue({
      data: { status: true, data: [{ id: "i1", invoice_no: "INV-1", grand_total: 5000 }] },
      isLoading: false,
    } as never);
    jest.mocked(PaymentService.useGetPaymentsQuery).mockReturnValue({
      data: { status: true, data: [{ invoice_id: "i1", remaining_amount: 3000 }] },
    } as never);
    mockRoute(undefined, null);
  });

  it("should expose options, the selected invoice and defaults for a new payment", (): void => {
    const { result } = renderHook(() => usePaymentCreate());

    expect(result.current).toMatchObject({ isEditMode: false, invoiceId: "", status: "", amount: null, isSubmitted: false, isLoadingOptions: false });
    expect(result.current.paymentMethods).toHaveLength(1);
    act(() => result.current.setInvoiceId("i1"));
    expect(result.current.selectedInvoice).toMatchObject({ id: "i1" });
  });

  it("should hydrate the form from route state in edit mode and go back", (): void => {
    mockRoute("p1", routePayment);
    const { result } = renderHook(() => usePaymentCreate());

    expect(result.current).toMatchObject({ isEditMode: true, invoiceId: "i1", status: "1", amount: 1000, isActive: true, paidAt: "2026-11-01T08:00" });
    result.current.goBack();
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("should not submit without an amount", async (): Promise<void> => {
    const { result } = renderHook(() => usePaymentCreate());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(create).not.toHaveBeenCalled();
  });

  it("should create a payment and navigate with a success message", async (): Promise<void> => {
    create.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true, messages: [] }) });
    const { result } = renderHook(() => usePaymentCreate());

    act(() => {
      result.current.setInvoiceId("i1");
      result.current.setPaymentMethodId("pm1");
      result.current.setStatus("1");
      result.current.setAmount(1000);
      result.current.setPaidAt("2026-11-01T08:00");
      result.current.setReferenceNo?.("R1");
    });
    await act(async () => result.current.handleSubmit(submitEvent));

    expect(create).toHaveBeenCalledWith(expect.objectContaining({ invoice_id: "i1", amount: 1000, status: 1 }));
    expect(navigate).toHaveBeenCalledWith("/document/payment", { state: { successMessage: "Payment created successfully." } });
  });

  it("should update in edit mode, and report API and thrown errors", async (): Promise<void> => {
    mockRoute("p1", routePayment);
    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true, messages: [] }) });
    const { result } = renderHook(() => usePaymentCreate());

    await act(async () => result.current.handleSubmit(submitEvent));
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: "p1" }));
    expect(navigate).toHaveBeenCalledWith("/document/payment", { state: { successMessage: "Payment updated successfully." } });

    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ status: false, messages: ["Denied"] }) });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Denied");

    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.reject(new Error("x")) });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Unable to update payment. Please try again.");
  });

  it("should show a validation message and skip the request when fields are missing", async (): Promise<void> => {
    const { result } = renderHook(() => usePaymentCreate());

    act(() => result.current.setAmount(1000));
    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.errorMessage).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });
});
