import { MOCK_EMAIL_SENDER_LIST_RESPONSE } from "@/fixture/master-email-sender";

import { getEmailSenderRowNumber, normalizeEmailSenderList } from "./MasterEmailSender.util";

describe("MasterEmailSender util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeEmailSenderList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      emailSenders: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeEmailSenderList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeEmailSenderList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_EMAIL_SENDER_LIST_RESPONSE, data: [{ id: "x" }] } as never;

    expect(normalizeEmailSenderList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no senders", () => {
    const data = { ...MOCK_EMAIL_SENDER_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeEmailSenderList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize senders with server, flags, status and date", () => {
    const listView = normalizeEmailSenderList({ data: MOCK_EMAIL_SENDER_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.emailSenders[0]).toEqual({
      id: "sender-1",
      name: "Finance Sender",
      email: "finance@company.com",
      smtpServer: "smtp.gmail.com:587",
      enableSsl: "yes",
      isDefault: "yes",
      status: "active",
      createdAt: "04 November 2026 23:04",
    });
    expect(listView.emailSenders[1]).toMatchObject({ enableSsl: "no", isDefault: "no", status: "inactive", createdAt: "-" });
  });

  it("should number rows across pages", () => {
    expect(getEmailSenderRowNumber(1, 10, 0)).toBe(1);
    expect(getEmailSenderRowNumber(3, 20, 4)).toBe(45);
  });
});
