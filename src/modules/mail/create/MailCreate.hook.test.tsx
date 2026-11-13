import { act, renderHook, waitFor } from "@/libs/unit-test";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { useMailCreate } from "./MailCreate.hook";

const mockSendMail = jest.fn().mockResolvedValue({ data: { status: true, messages: [] } });
const mockQuotationList = [{ id: "quotation-1", quotation_no: "QUO-001", transaction: { customer_name: "PT Example" } }];
const mockQuotationResponse = { status: true, data: mockQuotationList, messages: [] };
const mockInvoiceResponse = {
  status: true,
  data: [{ id: "invoice-1", invoice_no: "INV-001", customer: { name: "PT Invoice" } }],
  messages: [],
};
let mockResolvePdf: (file: File) => void = () => undefined;

jest.mock("@/services/mail/mail.service", () => ({
  buildMailSendFormData: jest.requireActual("@/services/mail/mail.service").buildMailSendFormData,
  useGetMailSendersQuery: () => ({ data: { data: [{ id: "sender-1", email: "sales@example.com" }] }, isLoading: false }),
  useSendMailMutation: () => [mockSendMail, { isLoading: false }],
}));

jest.mock("@/services/quotation.service", () => ({
  useGetQuotationOptionsQuery: () => ({ data: mockQuotationResponse, isLoading: false }),
}));

jest.mock("@/services/invoice.service", () => ({
  useGetInvoiceOptionsQuery: () => ({ data: mockInvoiceResponse, isLoading: false }),
}));

jest.mock("@/modules/quotation/Quotation.util", () => ({
  quotationToQuoteData: () => ({ id: "QUO-001" }),
}));

jest.mock("@/utils/pdfGenerator", () => ({
  generateQuotationPdfBlob: () => new Promise<File>((resolve) => { mockResolvePdf = resolve; }),
}));

const wrapper = ({ children }: { children: ReactNode }): ReactNode => <MemoryRouter>{children}</MemoryRouter>;

const fakeInputEvent = (value: string): { target: { value: string } } => ({ target: { value } });

describe("useMailCreate attachment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    URL.createObjectURL = jest.fn(() => "blob:quotation");
    URL.revokeObjectURL = jest.fn();
  });

  it("should wait for the generated quotation pdf before sending the mail", async () => {
    const initialResolve = mockResolvePdf;
    const { result } = renderHook(() => useMailCreate(), { wrapper });

    expect(result.current.quotationOptions).toEqual([{ label: "QUO-001 - PT Example", value: "quotation-1" }]);
    expect(result.current.invoiceOptions).toEqual([{ label: "INV-001 - PT Invoice", value: "invoice-1" }]);

    act(() => result.current.handleSenderChange("sales@example.com"));
    act(() => result.current.handleToChange(fakeInputEvent("customer@example.com") as never));
    act(() => result.current.handleSubjectChange(fakeInputEvent("Quotation") as never));
    act(() => result.current.handleBodyChange("<p>Please review</p>"));
    act(() => result.current.handleQuotationChange("quotation-1"));

    let submitted: Promise<void> = Promise.resolve();

    act(() => {
      submitted = result.current.handleSubmit({ preventDefault: jest.fn() } as never);
    });

    await waitFor(() => expect(mockResolvePdf).not.toBe(initialResolve));
    await act(async () => {
      mockResolvePdf(new File(["pdf"], "Quotation-QUO-001.pdf", { type: "application/pdf" }));
      await submitted;
    });

    await waitFor(() => expect(mockSendMail).toHaveBeenCalledTimes(1));
    const formData = mockSendMail.mock.calls[0][0] as FormData;

    expect(formData.get("attachments")).toBeInstanceOf(File);
    expect((formData.get("attachments") as File).name).toBe("Quotation-QUO-001.pdf");
  });
});
