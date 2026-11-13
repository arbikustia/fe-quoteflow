import test from "@/libs/unit-test";

import MailContainer from "./Mail.container";

jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => ({ canView: true }) }));
jest.mock("./Mail.hook", () => ({
  useMailNavigation: (): { goBack: () => void; goCompose: () => void } => ({ goBack: jest.fn(), goCompose: jest.fn() }),
  useMailPagination: (): Record<string, never> => ({}),
}));
jest.mock("./Mail.component", () => ({ MailComponent: (): React.ReactElement => <div>Mail rendered</div> }));

describe("MailContainer snapshot", () => {
  test.assertSnapshots(MailContainer, [{ props: {}, desc: "should render the module component" }]);
});
