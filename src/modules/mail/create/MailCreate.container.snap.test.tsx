import { MOCK_MAIL_FORM_PROPS } from "@/fixture/mail";
import test from "@/libs/unit-test";

import MailCreateContainer from "./MailCreate.container";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <main>{children}</main>);
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canCreate: boolean } => ({ canCreate: true }) }));
jest.mock("./MailCreate.hook", () => ({ useMailCreate: (): unknown => MOCK_MAIL_FORM_PROPS }));
jest.mock("./MailCreate.component", () => ({ MailCreateForm: (): React.ReactElement => <div>Form rendered</div> }));

describe("MailCreateContainer snapshot", () => {
  test.assertSnapshots(MailCreateContainer, [{ props: {}, desc: "should render the compose form" }]);
});
