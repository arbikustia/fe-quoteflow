import { MOCK_PERMISSION_PROPS } from "@/fixture/permission";
import { render, screen } from "@/libs/unit-test";

import PermissionContainer from "./Permission.container";

jest.mock("./Permission.hook", () => ({ usePermissionState: (): unknown => MOCK_PERMISSION_PROPS }));
jest.mock("./Permission.component", () => ({ PermissionComponent: (): React.ReactElement => <div>Permission rendered</div> }));

describe("PermissionContainer", () => {
  it("should render the permission component", () => {
    render(<PermissionContainer />);

    expect(screen.getByText("Permission rendered")).toBeInTheDocument();
  });
});
