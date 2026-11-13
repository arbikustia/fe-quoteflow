import { MOCK_MAIL_PROPS } from "@/fixture/mail";
import test from "@/libs/unit-test";

import { MailComponent } from "./Mail.component";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="mock-layout">{children}</div>);

describe("MailComponent snapshot", () => {
  test.assertSnapshots(MailComponent, [
    { props: MOCK_MAIL_PROPS, desc: "should render mail list" },
    { props: { ...MOCK_MAIL_PROPS, isLoading: true }, desc: "should render mail list while loading" },
  ]);
});
