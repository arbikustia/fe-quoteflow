import { act, renderHook } from "@/libs/unit-test";

import { usePaymentStatusForm } from "./PaymentStatus.hook";

import * as Router from "react-router-dom";
import * as PaymentService from "@/services/payment.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useLocation: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/payment.service", () => ({ useUpdatePaymentMutation: jest.fn() }));

const navigate = jest.fn();
const update = jest.fn();
const submitEvent = { preventDefault: jest.fn() } as never;
const payment = { invoiceId: "i1", paymentMethodId: "pm", amount: 1000, paidAt: "2026-11-01T08:00:00", referenceNo: "R1", notes: "n", status: "active" };

describe("usePaymentStatusForm", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "p1" });
    jest.mocked(Router.useLocation).mockReturnValue({ state: payment } as never);
    jest.mocked(PaymentService.useUpdatePaymentMutation).mockReturnValue([update, { isLoading: false }] as never);
  });

  it("should expose the reference number, toggle status and go back", (): void => {
    const { result } = renderHook(() => usePaymentStatusForm());

    expect(result.current).toMatchObject({ referenceNo: "R1", isActive: true, errorMessage: null });
    act(() => result.current.handleStatusChange(false));
    expect(result.current.isActive).toBe(false);
    result.current.goBack();
    expect(navigate).toHaveBeenCalledWith("/document/payment");
  });

  it("should submit the status and navigate with a success message", async (): Promise<void> => {
    update.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true, messages: [] }) });
    const { result } = renderHook(() => usePaymentStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: "p1", invoice_id: "i1", status: 1 }));
    expect(navigate).toHaveBeenCalledWith("/document/payment", { state: { successMessage: "Payment status updated successfully." } });
  });

  it("should show the API message or a fallback on failure", async (): Promise<void> => {
    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ status: false, messages: ["Nope"] }) });
    const { result } = renderHook(() => usePaymentStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Nope");

    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.reject(new Error("x")) });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Unable to update payment status.");
  });

  it("should report missing data without a payment", async (): Promise<void> => {
    jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
    const { result } = renderHook(() => usePaymentStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.errorMessage).toBe("Payment data is unavailable.");
    expect(update).not.toHaveBeenCalled();
  });
});
