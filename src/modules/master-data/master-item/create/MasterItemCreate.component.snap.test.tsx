import test from "@/libs/unit-test";

import MasterItemCreateComponent from "./MasterItemCreate.component";
import type { MasterItemCreateProps } from "./MasterItemCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const props: MasterItemCreateProps = {
  mode: "create",
  formStatus: "ready",
  values: {
    name: "Beam 290",
    categoryId: "c-1",
    price: "100000",
    stock: "11",
    duration: "1",
    image: "",
    remark: "",
    isActive: true,
  },
  fieldErrors: {},
  categoryOptions: [{ label: "Lighting Equipment", value: "c-1" }],
  isCategoryLoading: false,
  isSubmitting: false,
  isImageUploading: false,
  onTextChange: { name: jest.fn(), price: jest.fn(), stock: jest.fn(), duration: jest.fn() },
  onCategoryChange: jest.fn(),
  onRemarkChange: jest.fn(),
  onImageChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
};

describe("MasterItemCreateComponent Snapshot Test", () => {
  test.assertSnapshots(MasterItemCreateComponent, [
    { desc: "should render item create form", props },
    { desc: "should render item create form while submitting", props: { ...props, isSubmitting: true } },
    { desc: "should render item edit form with errors", props: { ...props, mode: "edit", fieldErrors: { name: "Item name is required." } } },
    { desc: "should render unavailable message in edit mode", props: { ...props, mode: "edit", formStatus: "error" } },
  ]);
});
