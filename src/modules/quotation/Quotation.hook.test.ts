import { act, renderHook } from "@/libs/unit-test";

import { useItemCategories, useQuotationNavigation, useQuotationPagination } from "./Quotation.hook";

import * as Router from "react-router-dom";
import * as ItemService from "@/services/master-item.service";
import * as QuotationService from "@/services/quotation.service";
import { generateQuotationPDF } from "@/utils/pdfGenerator";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));
jest.mock("@/utils/pdfGenerator", () => ({ generateQuotationPDF: jest.fn() }));
jest.mock("./Quotation.util", () => ({ quotationToQuoteData: jest.fn((data: unknown) => data) }));
jest.mock("@/services/master-item.service", () => ({ useGetAllItemsQuery: jest.fn() }));
jest.mock("@/services/quotation.service", () => ({
  mapQuotation: jest.fn((row: { id: string }) => ({ id: row.id })),
  useGetQuotationsQuery: jest.fn(),
  useLazyGetQuotationByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const getQuotation = jest.fn();

/**
 * Mock the quotations query result.
 * @param {object} result - Query result
 * @returns {void} - No return value
 */
const mockQuery = (result: object): void => {
  jest.mocked(QuotationService.useGetQuotationsQuery).mockReturnValue(result as never);
};

describe("Quotation hooks", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(QuotationService.useLazyGetQuotationByIdQuery).mockReturnValue([getQuotation] as never);
    jest.mocked(ItemService.useGetAllItemsQuery).mockReturnValue({ data: { status: true, data: [{ id: "i1", category_name: "Audio" }, { id: "i2" }] } } as never);
  });

  it("should map item categories with an Uncategorized fallback", (): void => {
    const { result } = renderHook(() => useItemCategories());

    expect(result.current.get("i1")).toBe("Audio");
    expect(result.current.get("i2")).toBe("Uncategorized");
  });

  it("should return an empty category map when items are unavailable", (): void => {
    jest.mocked(ItemService.useGetAllItemsQuery).mockReturnValue({ data: undefined } as never);

    expect(renderHook(() => useItemCategories()).result.current.size).toBe(0);
  });

  it.each([
    ["loading", { isLoading: true }, { isLoading: true, errorMessage: null }],
    ["error", { error: "x" }, { isLoading: false, errorMessage: "Unable to load quotations." }],
    ["no response", {}, { isMissingData: true, errorMessage: "No response received from server." }],
    ["no payload", { data: { status: true } }, { isMissingData: true, errorMessage: "Response is missing data payload." }],
    ["unavailable", { data: { status: false, data: [] } }, { errorMessage: "Quotation data is unavailable." }],
  ])("should derive the %s list state", (_name, query, expected): void => {
    mockQuery(query);

    expect(renderHook(() => useQuotationPagination()).result.current).toMatchObject(expected);
  });

  it("should map rows, clamp pages and reset page on size and search changes", (): void => {
    mockQuery({ data: { status: true, data: [{ id: "q1" }], total_pages: 3, total_count: 21 } });
    const { result } = renderHook(() => useQuotationPagination());

    expect(result.current).toMatchObject({ paginatedData: [{ id: "q1" }], totalPages: 3, totalCount: 21, isEmpty: false });

    act(() => result.current.goToPage(9));
    expect(result.current.currentPage).toBe(3);

    act(() => result.current.changePageSize(20));
    expect(result.current).toMatchObject({ pageSize: 20, currentPage: 1 });

    act(() => result.current.goToPage(2));
    act(() => result.current.setSearchTerm("abc"));
    expect(result.current.currentPage).toBe(1);
  });

  it("should flag an empty list", (): void => {
    mockQuery({ data: { status: true, data: [], total_pages: 0, total_count: 0 } });

    expect(renderHook(() => useQuotationPagination()).result.current.isEmpty).toBe(true);
  });

  it("should navigate from the list actions", (): void => {
    const { result } = renderHook(() => useQuotationNavigation());
    const row = { id: "q1", transactionId: "t1" } as never;

    result.current.onBack();
    result.current.onEdit(row);
    result.current.onStatus(row);
    result.current.onDetail(row);
    result.current.onRowClick(row);

    expect(navigate.mock.calls).toEqual([
      ["/document"],
      ["/order/create/t1", { state: { returnUrl: "/document/quotation", quotationId: "q1" } }],
      ["/document/quotation/q1"],
      ["/document/quotation/q1"],
      ["/document/quotation/q1"],
    ]);
  });

  it("should download the full quotation only when detail data exists", async (): Promise<void> => {
    const { result } = renderHook(() => useQuotationNavigation());

    getQuotation.mockReturnValueOnce({ unwrap: async (): Promise<object> => ({ data: { id: "q1" } }) });
    await result.current.onDownload({ id: "q1" } as never);
    expect(generateQuotationPDF).toHaveBeenCalledTimes(1);

    getQuotation.mockReturnValueOnce({ unwrap: async (): Promise<object> => ({ data: null }) });
    await result.current.onDownload({ id: "q1" } as never);
    expect(generateQuotationPDF).toHaveBeenCalledTimes(1);
  });
});
