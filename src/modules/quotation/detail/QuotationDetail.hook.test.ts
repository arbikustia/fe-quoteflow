import { act, renderHook } from "@/libs/unit-test";

import { useQuotationDetail } from "./QuotationDetail.hook";

import * as Router from "react-router-dom";
import * as QuotationService from "@/services/quotation.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("../Quotation.hook", () => ({ useItemCategories: (): Map<string, string> => new Map() }));
jest.mock("@/services/quotation.service", () => ({
  useApproveQuotationMutation: jest.fn(),
  useGetQuotationByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const approve = jest.fn();
const QUOTATION = { id: "q1", transaction_id: "t1", status: 1 };

/**
 * Mock the detail query result.
 * @param {object} result - Query result
 * @returns {void} - No return value
 */
const mockQuery = (result: object): void => {
  jest.mocked(QuotationService.useGetQuotationByIdQuery).mockReturnValue(result as never);
};

describe("useQuotationDetail", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "q1" });
    jest.mocked(QuotationService.useApproveQuotationMutation).mockReturnValue([approve, { isLoading: false }] as never);
    mockQuery({ data: { status: true, data: QUOTATION }, isLoading: false });
  });

  it("should expose the quotation and navigate back or to edit", (): void => {
    const { result } = renderHook(() => useQuotationDetail());

    expect(result.current.quotation).toEqual(QUOTATION);
    result.current.goBack();
    result.current.handleEdit();

    expect(navigate).toHaveBeenNthCalledWith(1, -1);
    expect(navigate).toHaveBeenNthCalledWith(2, "/order/create/t1", { state: { returnUrl: "/document/quotation/q1", quotationId: "q1" } });
  });

  it("should not edit an approved quotation", (): void => {
    mockQuery({ data: { status: true, data: { ...QUOTATION, status: 2 } }, isLoading: false });
    renderHook(() => useQuotationDetail()).result.current.handleEdit();

    expect(navigate).not.toHaveBeenCalled();
  });

  it.each([
    ["query error", { error: "x" }, "Unable to load quotation detail."],
    ["unavailable data", { data: { status: false } }, "Quotation detail is unavailable."],
    ["no error", { data: { status: true, data: QUOTATION } }, null],
  ])("should resolve the %s message", (_name, query, expected): void => {
    mockQuery(query);

    expect(renderHook(() => useQuotationDetail()).result.current.errorMessage).toBe(expected);
  });

  it("should approve, close the modal and open invoices", async (): Promise<void> => {
    approve.mockReturnValue({ unwrap: async (): Promise<object> => ({ status: true, messages: [] }) });
    const { result } = renderHook(() => useQuotationDetail());

    act(() => result.current.openApproveModal());
    expect(result.current.isConfirmOpen).toBe(true);

    await act(async () => result.current.handleApprove());

    expect(approve).toHaveBeenCalledWith({ id: "q1" });
    expect(result.current.isConfirmOpen).toBe(false);
    expect(navigate).toHaveBeenCalledWith("/document/invoice");
  });

  it("should show the response message when approval is rejected", async (): Promise<void> => {
    approve.mockReturnValue({ unwrap: async (): Promise<object> => ({ status: false, messages: ["Nope", "Really"] }) });
    const { result } = renderHook(() => useQuotationDetail());

    await act(async () => result.current.handleApprove());
    expect(result.current.errorMessage).toBe("Nope Really");

    act(() => result.current.closeApproveModal());
    expect(navigate).not.toHaveBeenCalled();
  });

  it("should show a fallback message when approval throws", async (): Promise<void> => {
    approve.mockReturnValue({ unwrap: async (): Promise<object> => { throw new Error("boom"); } });
    const { result } = renderHook(() => useQuotationDetail());

    await act(async () => result.current.handleApprove());

    expect(result.current.errorMessage).toBe("Unable to approve quotation.");
  });

  it("should skip approval without an id", async (): Promise<void> => {
    jest.mocked(Router.useParams).mockReturnValue({});
    const { result } = renderHook(() => useQuotationDetail());

    await act(async () => result.current.handleApprove());

    expect(approve).not.toHaveBeenCalled();
  });
});
