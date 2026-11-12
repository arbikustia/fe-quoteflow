import { MemoryRouter } from "react-router-dom";

import { MOCK_EMAIL_SENDER_LIST_RESPONSE } from "@/fixture/master-email-sender";
import { usePagePermission } from "@/hooks/usePagePermission";
import { render, screen } from "@/libs/unit-test";
import { useGetEmailSendersQuery } from "@/services/email-sender.service";

import MasterEmailSenderContainer from "./MasterEmailSender.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);
jest.mock("@/services/email-sender.service", () => ({ useGetEmailSendersQuery: jest.fn() }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

/**
 * Render the container inside a router.
 * @param {string} [successMessage] - Router state success message
 * @returns {void}
 */
const renderContainer = (successMessage?: string): void => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/master-email-sender", state: { successMessage } }]}>
      <MasterEmailSenderContainer />
    </MemoryRouter>,
  );
};

describe("MasterEmailSenderContainer", () => {
  beforeEach(() => {
    jest.mocked(useGetEmailSendersQuery).mockReturnValue({ data: MOCK_EMAIL_SENDER_LIST_RESPONSE, isLoading: false, isError: false } as never);
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: true, canEdit: true, isSuperadmin: false, isLoading: false });
  });

  it("should query the first page and render normalized senders", () => {
    renderContainer();

    expect(useGetEmailSendersQuery).toHaveBeenCalledWith({ pageNumber: 1, pageSize: 10, searchTerm: "" });
    expect(usePagePermission).toHaveBeenCalledWith("/master-email-sender");
    expect(screen.getAllByText("Support Sender")).toHaveLength(2);
    expect(screen.getAllByText("mail.company.com:465")).toHaveLength(2);
  });

  it("should hide create and edit actions without permission", () => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true, canCreate: false, canEdit: false, isSuperadmin: false, isLoading: false });

    renderContainer();

    expect(screen.queryByRole("button", { name: "Create Email Sender" })).not.toBeInTheDocument();
    expect(screen.queryAllByRole("button", { name: /^Edit email sender/ })).toHaveLength(0);
  });

  it("should show the success message from router state", () => {
    renderContainer("Email sender updated successfully.");

    expect(screen.getByRole("alert")).toHaveTextContent("Email sender updated successfully.");
  });
});
