import test from "@/libs/unit-test";

import MasterPicCreateComponent from "./MasterPicCreate.component";
import type { MasterPicCreateProps } from "./MasterPicCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterPicCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "Aurora", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterPicCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterPicCreateComponent, [
    { desc: "should render PIC create form", props },
    { desc: "should render PIC create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render PIC edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "PIC name is required." } } },
    { desc: "should render error message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
