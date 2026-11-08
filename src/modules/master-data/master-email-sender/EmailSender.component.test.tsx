import * as React from "react";

import { fireEvent, render, screen } from "@/libs/unit-test";
import * as ReactRouterDom from "react-router-dom";

import { EmailSenderComponent } from "./EmailSender.component";

import * as EmailSenderService from "@/services/email-sender.service";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("@/services/email-sender.service", () => ({
  useGetEmailSendersQuery: jest.fn(),
}));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  /**
   * Render a plain wrapper around children.
   *
   * @param {React.PropsWithChildren} props - Layout props
   * @returns {React.ReactElement} Wrapper element
   */
  default: (props: React.PropsWithChildren): React.ReactElement =>
    React.createElement("div", {}, props.children),
}));

jest.mock("@/app/shared/PageLayout", () => ({
  /**
   * Render page children with an accessible back action.
   *
   * @param {React.PropsWithChildren<{ onBack: () => void }>} props - Page layout props
   * @returns {React.ReactElement} Wrapper element
   */
  PageLayout: ({ children, onBack }: React.PropsWithChildren<{ onBack: () => void }>): React.ReactElement => (
    <section>
      <button type="button" onClick={onBack}>Page Back</button>
      {children}
    </section>
  ),
}));

jest.mock("@/components/Pagination", () => ({
  Pagination: jest.fn((): null => null),
}));

const mockSender = {
  id: "sender-1",
  name: "Finance Sender",
  email: "finance@company.com",
  smtp_host: "smtp.gmail.com",
  smtp_port: 587,
  smtp_username: "finance",
  enable_ssl: true,
  is_default: true,
  status: 1,
  created_at: "2024-01-01T08:00:00+07:00",
  updated_at: "2024-01-02T08:00:00+07:00",
};

const mockNavigate = jest.fn();

describe("EmailSenderComponent", () => {
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
        total_pages: 1,
        total_count: 1,
        has_previous: false,
        has_next: false,
        data: [mockSender],
      },
      isLoading: false,
    });
  });

  it("should render the sender row details on the mobile card", () => {
    render(<EmailSenderComponent />);

    expect(screen.getAllByText("Finance Sender").length).toBeGreaterThan(0);
    expect(screen.getAllByText("finance@company.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("smtp.gmail.com:587").length).toBeGreaterThan(0);
  });

  it("should render the empty state when there are no senders", () => {
    (EmailSenderService.useGetEmailSendersQuery as jest.Mock).mockReturnValue({
      data: {
        page_number: 1,
        total_pages: 0,
        total_count: 0,
        has_previous: false,
        has_next: false,
        data: [],
      },
      isLoading: false,
    });

    render(<EmailSenderComponent />);

    expect(screen.getAllByText("No email senders found.").length).toBeGreaterThan(0);
  });

  it("should render loading skeletons while the query is loading", () => {
    (EmailSenderService.useGetEmailSendersQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<EmailSenderComponent />);

    expect(screen.getByRole("status", { name: "Loading email sender table" })).toBeTruthy();
    expect(screen.getAllByRole("status", { name: "Loading email sender card" })).toHaveLength(5);
  });

  it("should navigate to the create form when the desktop create button is clicked", () => {
    render(<EmailSenderComponent />);

    fireEvent.click(screen.getByRole("button", { name: "Create Email Sender" }));

    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender/create");
  });

  it("should navigate to the edit form when a mobile card is clicked", () => {
    render(<EmailSenderComponent />);

    fireEvent.click(screen.getAllByRole("button", { name: /Finance Sender/ })[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/master-email-sender/edit/sender-1", {
      state: { emailSender: mockSender },
    });
  });

  it("should navigate back to the master menu from the page header", () => {
    render(<EmailSenderComponent />);

    fireEvent.click(screen.getByRole("button", { name: "Page Back" }));

    expect(mockNavigate).toHaveBeenCalledWith("/master-main");
  });

  it("should show the success toast from the route state", () => {
    jest.mocked(ReactRouterDom.useLocation).mockReturnValue({
      hash: "",
      key: "default",
      pathname: "/master-email-sender",
      search: "",
      state: { successMessage: "Email sender created successfully." },
    });

    render(<EmailSenderComponent />);

    expect(screen.getByText("Email sender created successfully.")).toBeTruthy();
  });
});
