import { MOCK_MAIL_FORM_PROPS } from "@/fixture/mail";
import { render, screen } from "@/libs/unit-test";

import MailCreateContainer from "./MailCreate.container";

const mockPermission = jest.fn();

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <main>{children}</main>);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: ({ to }: { to: string }): React.ReactElement => <div>Redirect to {to}</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canCreate: boolean } => mockPermission() as { canCreate: boolean } }));
jest.mock("./MailCreate.hook", () => ({ useMailCreate: (): unknown => MOCK_MAIL_FORM_PROPS }));
jest.mock("./MailCreate.component", () => ({ MailCreateForm: (): React.ReactElement => <div>Form rendered</div> }));

describe("MailCreateContainer", () => {
  it("should render the compose form when create is allowed", () => {
    mockPermission.mockReturnValue({ canCreate: true });
    render(<MailCreateContainer />);

    expect(screen.getByText("Form rendered")).toBeInTheDocument();
  });

  it("should redirect to the mail list when create is denied", () => {
    mockPermission.mockReturnValue({ canCreate: false });
    render(<MailCreateContainer />);

    expect(screen.getByText("Redirect to /mail")).toBeInTheDocument();
  });
});
