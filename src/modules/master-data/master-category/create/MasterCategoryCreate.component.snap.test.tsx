import test from "@/libs/unit-test";

import MasterCategoryCreateComponent from "./MasterCategoryCreate.component";
import type { MasterCategoryCreateProps } from "./MasterCategoryCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterCategoryCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: { name: "Audio System", isActive: true },
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterCategoryCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterCategoryCreateComponent, [
    { desc: "should render category create form", props },
    { desc: "should render category create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render category edit form with error", props: { ...props, mode: "edit", nameError: "Category name is required." } },
    { desc: "should render unavailable message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
