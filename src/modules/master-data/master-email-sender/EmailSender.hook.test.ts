import { act, renderHook } from "@/libs/unit-test";
import * as ReactRouterDom from "react-router-dom";

import { useEmailSender } from "./EmailSender.hook";
import type { EmailSender } from "./EmailSender.type";

import * as EmailSenderService from "@/services/email-sender.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("@/services/email-sender.service", () => ({
  useGetEmailSendersQuery: jest.fn(),
}));

const mockSender: EmailSender = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  enable_ssl: true,
  is_default: true,
  status: 1,
  created_at: "2024-01-01",
  updated_at: "2024-01-02",
};

const mockNavigate = jest.fn();

describe("useEmailSender", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(ReactRouterDom.useNavigate).mockReturnValue(mockNavigate);
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
      hash: "",
      key: "default",
      pathname: "/master-email-sender",
      search: "",
      state: null,
    });
    (EmailSenderService.useGetEmailSendersQuery as jest.Mock).mockReturnValue({
      data: {
        page_number: 1,
        total_pages: 3,
        total_count: 21,
        has_previous: false,
        has_next: true,
        data: [mockSender],
      },
      isLoading: false,
    });
  });

  it("should map the query response into list state", () => {
    const { result } = renderHook(() => useEmailSender());

    expect(result.current.rows).toEqual([mockSender]);
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalCount).toBe(21);
    expect(result.current.loading).toBe(false);
  });

  it("should expose an empty list while the query has no data", () => {
    (EmailSenderService.useGetEmailSendersQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { result } = renderHook(() => useEmailSender());

    expect(result.current.rows).toEqual([]);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(true);
  });

  it("should reset to the first page when the search term changes", () => {
    const { result } = renderHook(() => useEmailSender());

    act(() => result.current.setPage(3));
    expect(EmailSenderService.useGetEmailSendersQuery).toHaveBeenLastCalledWith({
      pageNumber: 3,
      pageSize: 10,
      searchTerm: "",
    });

    act(() => result.current.setSearch("finance"));
    expect(EmailSenderService.useGetEmailSendersQuery).toHaveBeenLastCalledWith({
      pageNumber: 1,
      pageSize: 10,
      searchTerm: "finance",
    });
    expect(result.current.page).toBe(1);
  });

  it("should surface the success message from the route state", () => {
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
      hash: "",
      key: "default",
      pathname: "/master-email-sender",
      search: "",
      state: { successMessage: "Email sender created successfully." },
    });

    const { result } = renderHook(() => useEmailSender());

    expect(result.current.successMessage).toBe("Email sender created successfully.");
  });

  it("should navigate to the create, edit and back routes", () => {
    const { result } = renderHook(() => useEmailSender());

    act(() => result.current.create());
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender/create");

    act(() => result.current.edit(mockSender));
    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender/edit/sender-1", {
      state: { emailSender: mockSender },
    });

    act(() => result.current.back());
    expect(mockNavigate).toHaveBeenCalledWith("/master-main");
  });
});
