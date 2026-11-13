import { MOCK_MAIL_PROPS } from "@/fixture/mail";
import { render, screen } from "@/libs/unit-test";

import MailContainer from "./Mail.container";

const mockPermission = jest.fn();
const mockLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: (): unknown => mockLocation(),
}));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => mockPermission() as { canView: boolean } }));
jest.mock("@/components/Alert", () => ({ AlertComponent: ({ message }: { message: string }): React.ReactElement => <div role="alert">{message}</div> }));
jest.mock("./Mail.hook", () => ({
  useMailNavigation: (): { goBack: () => void; goCompose: () => void } => ({ goBack: jest.fn(), goCompose: jest.fn() }),
  useMailPagination: (): unknown => MOCK_MAIL_PROPS,
}));
jest.mock("./Mail.component", () => ({ MailComponent: (): React.ReactElement => <div>Mail rendered</div> }));

describe("MailContainer", () => {
  beforeEach(() => {
    mockPermission.mockReturnValue({ canView: true });
    mockLocation.mockReturnValue({ state: undefined });
  });

  it("should render the module component when view is allowed", () => {
    render(<MailContainer />);

    expect(screen.getByText("Mail rendered")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("should render the success alert from route state", () => {
    mockLocation.mockReturnValue({ state: { successMessage: "Mail sent successfully." } });
    render(<MailContainer />);

    expect(screen.getByRole("alert")).toHaveTextContent("Mail sent successfully.");
  });

  it("should render nothing when view is denied", () => {
    mockPermission.mockReturnValue({ canView: false });
    render(<MailContainer />);

    expect(screen.queryByText("Mail rendered")).toBeNull();
  });
});
