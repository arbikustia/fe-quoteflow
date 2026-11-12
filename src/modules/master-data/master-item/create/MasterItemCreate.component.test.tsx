import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterItemCreateComponent from "./MasterItemCreate.component";
import { ITEM_FORM_DEFAULT_VALUES } from "./MasterItemCreate.config";
import type { MasterItemCreateProps } from "./MasterItemCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterItemCreateProps>} [overrides] - Props to override
 * @returns {MasterItemCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterItemCreateProps>): MasterItemCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: ITEM_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  categoryOptions: [{ label: "Audio", value: "c-1" }],
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
  ...overrides,
});

describe("MasterItemCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterItemCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Item")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input, remark, image and submit events", () => {
    const props = createProps();
    const file = new File(["x"], "beam.jpg");

    render(<MasterItemCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Wireless Microphone"), { target: { value: "Mic" } });
    fireEvent.change(screen.getByPlaceholderText("Rp 0"), { target: { value: "Rp 10" } });
    fireEvent.change(screen.getByLabelText("Remarks"), { target: { value: "Note" } });
    fireEvent.change(screen.getByLabelText("Upload image"), { target: { files: [file] } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Item" }));

    expect(props.onTextChange.name).toHaveBeenCalledTimes(1);
    expect(props.onTextChange.price).toHaveBeenCalledTimes(1);
    expect(props.onRemarkChange).toHaveBeenCalledTimes(1);
    expect(props.onImageChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show formatted price, uploaded image and errors", () => {
    render(
      <MasterItemCreateComponent
        {...createProps({
          values: { ...ITEM_FORM_DEFAULT_VALUES, price: "100000", image: "https://cdn.example.com/a/beam.jpg" },
          fieldErrors: { name: "Item name is required." },
          categoryErrorMessage: "Category is required.",
          imageUploadError: "Unable to upload image. Please try again.",
          isImageUploading: true,
        })}
      />,
    );

    expect(screen.getByDisplayValue("Rp 100.000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Uploaded: beam.jpg" })).toHaveAttribute("href", "https://cdn.example.com/a/beam.jpg");
    expect(screen.getByText("Item name is required.")).toBeInTheDocument();
    expect(screen.getByText("Category is required.")).toBeInTheDocument();
    expect(screen.getByText("Uploading image…")).toBeInTheDocument();
    expect(screen.getByText("Unable to upload image. Please try again.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...ITEM_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true, isCategoryLoading: true });

    render(<MasterItemCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch"));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the unavailable message instead of the form", () => {
    render(<MasterItemCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("Item data is unavailable. Open the item from the item list to edit it.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Item" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterItemCreateComponent {...createProps({ errorMessage: "Duplicate item" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate item");
  });
});
