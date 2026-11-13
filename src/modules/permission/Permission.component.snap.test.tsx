import { MOCK_PERMISSION_PROPS } from "@/fixture/permission";
import test from "@/libs/unit-test";

import { PermissionComponent } from "./Permission.component";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>);
jest.mock("@/app/shared/PageLayout", () => ({ PageLayout: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div> }));
jest.mock("@/components/Select/Select.component", () => ({ Select: (): React.ReactElement => <div data-testid="user-select" /> }));

describe("PermissionComponent snapshot", () => {
  test.assertSnapshots(PermissionComponent, [
    { props: MOCK_PERMISSION_PROPS, desc: "should render the permission list" },
    { props: { ...MOCK_PERMISSION_PROPS, selectedUsername: "", rows: [] }, desc: "should ask to select a user" },
    { props: { ...MOCK_PERMISSION_PROPS, rows: [], isEmpty: true }, desc: "should render the empty state" },
  ]);
});
