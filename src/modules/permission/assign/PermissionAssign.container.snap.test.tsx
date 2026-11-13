import test from "@/libs/unit-test";

import PermissionAssignContainer from "./PermissionAssign.container";

jest.mock("./PermissionAssign.hook", () => ({ usePermissionAssign: (): Record<string, never> => ({}) }));
jest.mock("./PermissionAssign.component", () => ({ PermissionAssignComponent: (): React.ReactElement => <div>Assign rendered</div> }));

describe("PermissionAssignContainer snapshot", () => {
  test.assertSnapshots(PermissionAssignContainer, [{ props: {}, desc: "should render the assign component" }]);
});
