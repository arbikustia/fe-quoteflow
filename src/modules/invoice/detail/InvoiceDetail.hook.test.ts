import { act, renderHook } from "@/libs/unit-test";

import { useInvoiceDetail } from "./InvoiceDetail.hook";

import * as Router from "react-router-dom";
import * as InvoiceService from "@/services/invoice.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/invoice.service", () => ({
  useApproveInvoiceMutation: jest.fn(),
  useGetInvoiceByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const approve = jest.fn();

/**
 * Mock the invoice detail query result.
 * @param {object} result - Query result
 * @returns {void} - Nothing
 */
const mockQuery = (result: object): void => {
  jest.mocked(InvoiceService.useGetInvoiceByIdQuery).mockReturnValue(result as never);
};

const invoice = { id: "i1", status: 1, transaction_id: "t1", quotation: { transaction: { id: "tx1" } } };

describe("useInvoiceDetail", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "i1" });
    jest.mocked(InvoiceService.useApproveInvoiceMutation).mockReturnValue([approve, { isLoading: false }] as never);
    mockQuery({ data: { status: true, data: invoice }, error: undefined, isLoading: false });
  });

  it("should expose the invoice and go back", (): void => {
    const { result } = renderHook(() => useInvoiceDetail());

    expect(result.current.invoice).toEqual(invoice);
    expect(result.current.errorMessage).toBeNull();
    result.current.goBack();
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("should resolve query and missing-data error messages", (): void => {
    mockQuery({ data: undefined, error: new Error("x"), isLoading: false });
    expect(renderHook(() => useInvoiceDetail()).result.current.errorMessage).toBe("Unable to load invoice detail.");

    mockQuery({ data: { status: false, data: null }, error: undefined, isLoading: false });
    expect(renderHook(() => useInvoiceDetail()).result.current.errorMessage).toBe("Invoice detail is unavailable.");
  });

  it("should open the order edit form only for editable invoices with a transaction", (): void => {
    const { result } = renderHook(() => useInvoiceDetail());

    result.current.handleEdit();
    expect(navigate).toHaveBeenCalledWith("/order/create/tx1", { state: { returnUrl: "/document/invoice/i1" } });

    navigate.mockClear();
    mockQuery({ data: { status: true, data: { ...invoice, status: 2 } }, isLoading: false });
    renderHook(() => useInvoiceDetail()).result.current.handleEdit();
    mockQuery({ data: { status: true, data: { id: "i1", status: 1 } }, isLoading: false });
    renderHook(() => useInvoiceDetail()).result.current.handleEdit();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should toggle the approval modal", (): void => {
    const { result } = renderHook(() => useInvoiceDetail());

    act(() => result.current.openApproveModal());
    expect(result.current.isConfirmOpen).toBe(true);
    act(() => result.current.closeApproveModal());
    expect(result.current.isConfirmOpen).toBe(false);
  });

  it("should approve and navigate to the list", async (): Promise<void> => {
    approve.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true, messages: [] }) });
    const { result } = renderHook(() => useInvoiceDetail());

    await act(async () => result.current.handleApprove());

    expect(approve).toHaveBeenCalledWith({ id: "i1" });
    expect(navigate).toHaveBeenCalledWith("/document/invoice");
  });

  it("should show the API message or a fallback when approval fails", async (): Promise<void> => {
    approve.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ status: false, messages: ["Denied"] }) });
    const { result } = renderHook(() => useInvoiceDetail());

    await act(async () => result.current.handleApprove());
    expect(result.current.errorMessage).toBe("Denied");

    approve.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.reject(new Error("x")) });
    await act(async () => result.current.handleApprove());
    expect(result.current.errorMessage).toBe("Unable to approve invoice.");
  });

  it("should not approve without an invoice", async (): Promise<void> => {
    mockQuery({ data: undefined, isLoading: true });
    const { result } = renderHook(() => useInvoiceDetail());

    await act(async () => result.current.handleApprove());

    expect(approve).not.toHaveBeenCalled();
  });
});
