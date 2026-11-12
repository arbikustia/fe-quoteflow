import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MOCK_API_EMAIL_SENDERS } from "@/fixture/master-email-sender";
import { fireEvent, render, screen, waitFor } from "@/libs/unit-test";
import { useCreateEmailSenderMutation, useGetEmailSenderByIdQuery, useUpdateEmailSenderMutation } from "@/services/email-sender.service";

import MasterEmailSenderCreateContainer from "./MasterEmailSenderCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/email-sender.service", () => ({
  useGetEmailSenderByIdQuery: jest.fn(),
  useCreateEmailSenderMutation: jest.fn(),
  useUpdateEmailSenderMutation: jest.fn(),
}));

const updateEmailSender = jest.fn(() => ({ unwrap: (): Promise<{ status: boolean }> => Promise.resolve({ status: true }) }));

/**
 * Render the container on the given route.
 * @param {string} path - Initial route
 * @returns {void}
 */
const renderAt = (path: string): void => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/master-email-sender" element={<p>Email sender list</p>} />
        <Route path="/master-email-sender/create" element={<MasterEmailSenderCreateContainer />} />
        <Route path="/master-email-sender/edit/:id" element={<MasterEmailSenderCreateContainer />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MasterEmailSenderCreateContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetEmailSenderByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: false } as never);
    jest.mocked(useCreateEmailSenderMutation).mockReturnValue([jest.fn(), { isLoading: false }] as never);
    jest.mocked(useUpdateEmailSenderMutation).mockReturnValue([updateEmailSender, { isLoading: false }] as never);
  });

  it("should render an empty create form and skip the detail query", () => {
    renderAt("/master-email-sender/create");

    expect(useGetEmailSenderByIdQuery).toHaveBeenCalledWith("", { skip: true });
    expect(screen.getByRole("button", { name: "Create Email Sender" })).toBeInTheDocument();
  });

  it("should load the sender by id and submit the update", async () => {
    jest.mocked(useGetEmailSenderByIdQuery).mockReturnValue({
      data: { status: true, messages: [], data: MOCK_API_EMAIL_SENDERS[0] },
      isLoading: false,
      isError: false,
    } as never);

    renderAt("/master-email-sender/edit/sender-1");

    await waitFor(() => expect(screen.getByDisplayValue("Finance Sender")).toBeInTheDocument());
    fireEvent.submit(screen.getByRole("button", { name: "Update Email Sender" }));

    await waitFor(() => expect(screen.getByText("Email sender list")).toBeInTheDocument());
    expect(useGetEmailSenderByIdQuery).toHaveBeenCalledWith("sender-1", { skip: false });
    expect(updateEmailSender).toHaveBeenCalledWith({
      id: "sender-1",
      name: "Finance Sender",
      email: "finance@company.com",
      smtp_host: "smtp.gmail.com",
      smtp_port: 587,
      smtp_username: "finance",
      smtp_password: "",
      enable_ssl: true,
      is_default: true,
      status: 1,
    });
  });

  it("should show the load error when the sender cannot be fetched", () => {
    jest.mocked(useGetEmailSenderByIdQuery).mockReturnValue({ data: undefined, isLoading: false, isError: true } as never);

    renderAt("/master-email-sender/edit/sender-1");

    expect(screen.getByText("Unable to load email sender data. Please try again.")).toBeInTheDocument();
  });
});
