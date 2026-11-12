import { act, renderHook } from "@/libs/unit-test";

import { useInvoiceNavigation, useInvoicePagination } from "./Invoice.hook";

import * as Router from "react-router-dom";
import * as InvoiceService from "@/services/invoice.service";
import { generateInvoicePDF } from "@/utils/pdfGenerator";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));
jest.mock("@/utils/pdfGenerator", () => ({ generateInvoicePDF: jest.fn() }));
jest.mock("@/services/invoice.service", () => ({
  mapInvoice: (invoice: { id: string }): { id: string } => ({ id: invoice.id }),
  useGetInvoicesQuery: jest.fn(),
  useLazyGetInvoiceByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const getInvoice = jest.fn();

describe("useInvoicePagination", (): void => {
  beforeEach((): void => {
    jest.mocked(InvoiceService.useGetInvoicesQuery).mockReturnValue({
      data: { data: [{ id: "a" }], total_pages: 3, total_count: 25 },
      isLoading: false,
      isError: false,
    } as never);
  });

  it("should map rows and totals from the query", (): void => {
    const { result } = renderHook(() => useInvoicePagination());

    expect(result.current).toMatchObject({ currentPage: 1, pageSize: 10, totalPages: 3, totalCount: 25, isEmpty: false });
    expect(result.current.paginatedData).toEqual([{ id: "a" }]);
  });

  it("should bound page, reset on search and page size change", (): void => {
    const { result } = renderHook(() => useInvoicePagination());

    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.setSearchTerm("x"));
    expect(result.current.currentPage).toBe(1);
    act(() => result.current.goToPage(2));
    act(() => result.current.changePageSize(20));
    expect(result.current).toMatchObject({ currentPage: 1, pageSize: 20 });
  });

  it("should flag empty and error states", (): void => {
    jest.mocked(InvoiceService.useGetInvoicesQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);
    expect(renderHook(() => useInvoicePagination()).result.current.errorMessage).toBe("Unable to load invoices.");

    jest.mocked(InvoiceService.useGetInvoicesQuery).mockReturnValue({ data: { data: [] }, isLoading: false, isError: false } as never);
    expect(renderHook(() => useInvoicePagination()).result.current.isEmpty).toBe(true);
  });
});

describe("useInvoiceNavigation", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(InvoiceService.useLazyGetInvoiceByIdQuery).mockReturnValue([getInvoice] as never);
  });

  it("should navigate back, to detail and from row click", (): void => {
    const { result } = renderHook(() => useInvoiceNavigation());

    result.current.onBack();
    expect(navigate).toHaveBeenCalledWith("/document");
    result.current.onDetail({ id: "i1" } as never);
    result.current.onRowClick({ id: "i2" } as never);
    expect(navigate).toHaveBeenCalledWith("/document/invoice/i1");
    expect(navigate).toHaveBeenCalledWith("/document/invoice/i2");
  });

  it("should navigate to order edit with the transaction id, falling back to invoice id", (): void => {
    const { result } = renderHook(() => useInvoiceNavigation());

    result.current.onEdit({ id: "i1", transactionId: "t1" } as never);
    result.current.onEdit({ id: "i2", transactionId: "" } as never);

    expect(navigate).toHaveBeenCalledWith("/order/create/t1", { state: { returnUrl: "/document/invoice" } });
    expect(navigate).toHaveBeenCalledWith("/order/create/i2", { state: { returnUrl: "/document/invoice" } });
  });

  it("should generate the PDF only when detail data exists", async (): Promise<void> => {
    const { result } = renderHook(() => useInvoiceNavigation());

    getInvoice.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ data: { invoice_no: "INV-1", id: "i1", invoice_date: "2026-10-01", status: 1 } }) });
    await result.current.onDownload({ id: "i1" } as never);
    expect(generateInvoicePDF).toHaveBeenCalledTimes(1);

    getInvoice.mockReturnValueOnce({ unwrap: (): Promise<unknown> => Promise.resolve({ data: null }) });
    await result.current.onDownload({ id: "i1" } as never);
    expect(generateInvoicePDF).toHaveBeenCalledTimes(1);
  });
});
