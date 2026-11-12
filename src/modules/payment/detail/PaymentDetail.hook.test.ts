import { renderHook } from "@/libs/unit-test";

import { usePaymentDetail } from "./PaymentDetail.hook";

import * as Router from "react-router-dom";
import * as PaymentService from "@/services/payment.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useLocation: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/payment.service", () => ({
  mapPaymentSummary: jest.fn((summary: { invoice_no: string }) => ({ id: "x", invoiceId: "i1", invoiceNo: summary.invoice_no })),
  useGetAllInvoicesQuery: jest.fn(),
  useGetPaymentByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const routePayment = { id: "route", invoiceId: "i1", invoiceNo: "INV-R", paymentMethodId: "pm-route" };

/**
 * Mock the payment detail and invoice queries.
 * @param {object} detail - Detail query result
 * @param {object} [invoices] - Invoice query result
 * @returns {void} - Nothing
 */
const mockQueries = (detail: object, invoices: object = { data: undefined }): void => {
  jest.mocked(PaymentService.useGetPaymentByIdQuery).mockReturnValue(detail as never);
  jest.mocked(PaymentService.useGetAllInvoicesQuery).mockReturnValue(invoices as never);
};

describe("usePaymentDetail", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "INV-1" });
    jest.mocked(Router.useLocation).mockReturnValue({ state: null } as never);
  });

  it("should map the API summary, method name and linked invoice", (): void => {
    mockQueries(
      { data: { status: true, data: { invoice_no: "INV-1", payments: [{ payment_method_name: "BCA" }] } }, error: undefined, isLoading: false },
      { data: { status: true, data: [{ id: "i1", invoice_no: "INV-1" }] } },
    );
    const { result } = renderHook(() => usePaymentDetail());

    expect(result.current.payment).toMatchObject({ invoiceNo: "INV-1" });
    expect(result.current.methodName).toBe("BCA");
    expect(result.current.linkedInvoice).toMatchObject({ id: "i1" });
    expect(result.current.errorMessage).toBeNull();
  });

  it("should fall back to route state, in both state shapes", (): void => {
    mockQueries({ data: undefined, error: undefined, isLoading: false });
    jest.mocked(Router.useLocation).mockReturnValue({ state: routePayment } as never);
    expect(renderHook(() => usePaymentDetail()).result.current.payment).toEqual(routePayment);

    jest.mocked(Router.useLocation).mockReturnValue({ state: { payment: routePayment } } as never);
    const { result } = renderHook(() => usePaymentDetail());

    expect(result.current.payment).toEqual(routePayment);
    expect(result.current.methodName).toBe("pm-route");
  });

  it("should resolve error messages when no payment is available", (): void => {
    mockQueries({ data: undefined, error: new Error("x"), isLoading: false });
    expect(renderHook(() => usePaymentDetail()).result.current.errorMessage).toBe("Unable to load payment detail.");

    mockQueries({ data: undefined, error: undefined, isLoading: false });
    expect(renderHook(() => usePaymentDetail()).result.current.errorMessage).toBe("Payment detail is unavailable.");
  });

  it("should navigate back and to the status form", (): void => {
    mockQueries({ data: { status: true, data: { invoice_no: "INV-1", payments: [] } }, error: undefined, isLoading: false });
    const { result } = renderHook(() => usePaymentDetail());

    result.current.goBack();
    result.current.handleStatus();

    expect(navigate).toHaveBeenCalledWith("/document/payment");
    expect(navigate).toHaveBeenCalledWith("/document/payment/INV-1/status", { state: expect.objectContaining({ invoiceNo: "INV-1" }) });
  });
});
