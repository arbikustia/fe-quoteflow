import { MOCK_PERMISSION_PROPS } from "@/fixture/permission";
import test from "@/libs/unit-test";

import PermissionContainer from "./Permission.container";

jest.mock("./Permission.hook", () => ({ usePermissionState: (): unknown => MOCK_PERMISSION_PROPS }));
jest.mock("./Permission.component", () => ({ PermissionComponent: (): React.ReactElement => <div>Permission rendered</div> }));

describe("PermissionContainer snapshot", () => {
  test.assertSnapshots(PermissionContainer, [{ props: {}, desc: "should render the permission component" }]);
});
