import { act, renderHook } from "@/libs/unit-test";

import { useQuotationStatusForm } from "./QuotationStatus.hook";

import * as Router from "react-router-dom";
import * as QuotationService from "@/services/quotation.service";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn(), useParams: jest.fn() }));
jest.mock("@/services/quotation.service", () => ({
  useApproveQuotationMutation: jest.fn(),
  useGetQuotationByIdQuery: jest.fn(),
}));

const navigate = jest.fn();
const approve = jest.fn();
const submitEvent = { preventDefault: jest.fn() } as never;

/**
 * Mock the quotation query result.
 * @param {object} result - Query result
 * @returns {void} - No return value
 */
const mockQuery = (result: object): void => {
  jest.mocked(QuotationService.useGetQuotationByIdQuery).mockReturnValue(result as never);
};

describe("useQuotationStatusForm", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(Router.useNavigate).mockReturnValue(navigate);
    jest.mocked(Router.useParams).mockReturnValue({ id: "q1" });
    jest.mocked(QuotationService.useApproveQuotationMutation).mockReturnValue([approve, { isLoading: false }] as never);
    mockQuery({ data: { status: true, data: { quotation_no: "QUO-1", status: 1 } }, isLoading: false });
  });

  it("should expose the quotation number and go back", (): void => {
    const { result } = renderHook(() => useQuotationStatusForm());

    expect(result.current).toMatchObject({ quotationNumber: "QUO-1", isApproved: false, errorMessage: null });
    result.current.goBack();
    expect(navigate).toHaveBeenCalledWith("/document/quotation");
  });

  it.each([
    ["missing id", {}, { data: undefined }, "Quotation ID is unavailable."],
    ["query error", { id: "q1" }, { error: "x" }, "Unable to load quotation data."],
    ["invalid data", { id: "q1" }, { data: { status: true, data: null } }, "Unable to load quotation data."],
  ])("should resolve the %s message", (_name, params, query, expected): void => {
    jest.mocked(Router.useParams).mockReturnValue(params);
    mockQuery(query);

    expect(renderHook(() => useQuotationStatusForm()).result.current.errorMessage).toBe(expected);
  });

  it("should refuse to submit until approved", async (): Promise<void> => {
    const { result } = renderHook(() => useQuotationStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.errorMessage).toBe("Approve this quotation before submitting.");
    expect(approve).not.toHaveBeenCalled();
  });

  it("should refuse to submit without quotation data", async (): Promise<void> => {
    mockQuery({ data: undefined, isLoading: false });
    const { result } = renderHook(() => useQuotationStatusForm());

    await act(async () => result.current.handleSubmit(submitEvent));

    expect(result.current.errorMessage).toBe("Quotation data is unavailable.");
  });

  it("should approve and open invoices with a success message", async (): Promise<void> => {
    approve.mockReturnValue({ unwrap: async (): Promise<object> => ({ status: true, messages: [] }) });
    const { result } = renderHook(() => useQuotationStatusForm());

    act(() => result.current.handleStatusChange(true));
    await act(async () => result.current.handleSubmit(submitEvent));

    expect(approve).toHaveBeenCalledWith({ id: "q1" });
    expect(navigate).toHaveBeenCalledWith("/document/invoice", { state: { successMessage: "Quotation approved successfully." } });
  });

  it("should show the response error or a fallback when approval fails", async (): Promise<void> => {
    approve.mockReturnValueOnce({ unwrap: async (): Promise<object> => ({ status: false, messages: [] }) });
    const { result } = renderHook(() => useQuotationStatusForm());

    act(() => result.current.handleStatusChange(true));
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Unable to update quotation status.");

    approve.mockReturnValueOnce({ unwrap: async (): Promise<object> => { throw new Error("boom"); } });
    await act(async () => result.current.handleSubmit(submitEvent));
    expect(result.current.errorMessage).toBe("Unable to update quotation status.");
    expect(navigate).not.toHaveBeenCalled();
  });
});
