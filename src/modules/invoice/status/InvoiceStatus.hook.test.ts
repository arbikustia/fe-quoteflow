import { act, renderHook } from "@/libs/unit-test";

import { useInvoiceStatusForm } from "./InvoiceStatus.hook";

import * as Router from "react-router-dom";
import * as InvoiceService from "@/services/invoice.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/invoice.service", () => ({
  useGetInvoiceByIdQuery: jest.fn(),
  useUpdateInvoiceMutation: jest.fn(),
}));

const navigate = jest.fn();
const update = jest.fn();
const submitEvent = { preventDefault: jest.fn() } as never;

describe("useInvoiceStatusForm", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "i1" });
    jest.mocked(InvoiceService.useUpdateInvoiceMutation).mockReturnValue([update, { isLoading: false }] as never);
    jest.mocked(InvoiceService.useGetInvoiceByIdQuery).mockReturnValue({
      data: { status: true, data: { invoice_no: "INV-1", status: 1, transaction_id: "t1" } },
      isLoading: false,
    } as never);
  });

  it("should expose the invoice number, toggle status and go back", (): void => {
    const { result } = renderHook(() => useInvoiceStatusForm());

    expect(result.current).toMatchObject({ invoiceNumber: "INV-1", isActive: true, errorMessage: null });
    act(() => result.current.handleStatusChange(false));
    expect(result.current.isActive).toBe(false);
    result.current.goBack();
    expect(navigate).toHaveBeenCalledWith("/document/invoice");
  });

  it("should submit the status and navigate with a success message", async (): Promise<void> => {
    update.mockReturnValue({ unwrap: (): Promise<unknown> => Promise.resolve({ status: true, messages: [] }) });
    const { result } = renderHook(() => useInvoiceStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(update).toHaveBeenCalledWith({ id: "i1", payload: { transaction_id: "t1", status: 1 } });
    expect(navigate).toHaveBeenCalledWith("/document/invoice", { state: { successMessage: "Invoice status updated successfully." } });
  });

  it("should show the API message or a fallback on failure", async (): Promise<void> => {
    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ status: false, messages: ["Nope"] }) });
    const { result } = renderHook(() => useInvoiceStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Nope");

    update.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.reject(new Error("x")) });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Unable to update invoice status.");
  });

  it("should report missing data when the route id is absent", async (): Promise<void> => {
    jest.mocked(Router.useParams).mockReturnValue({});
    jest.mocked(InvoiceService.useGetInvoiceByIdQuery).mockReturnValue({ data: undefined, isLoading: false } as never);
    const { result } = renderHook(() => useInvoiceStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.errorMessage).toBe("Invoice data is unavailable.");
    expect(update).not.toHaveBeenCalled();
  });
});
