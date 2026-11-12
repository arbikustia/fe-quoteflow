import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterCategoryCreateComponent from "./MasterCategoryCreate.component";
import type { MasterCategoryCreateProps } from "./MasterCategoryCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterCategoryCreateProps>} [overrides] - Props to override
 * @returns {MasterCategoryCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterCategoryCreateProps>): MasterCategoryCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: { name: "", isActive: true },
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterCategoryCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterCategoryCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Category")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward name input and submit", () => {
    const props = createProps();

    render(<MasterCategoryCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Audio System"), { target: { value: "Audio" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Category" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show the name error", () => {
    render(<MasterCategoryCreateComponent {...createProps({ nameError: "Category name is required." })} />);

    expect(screen.getByText("Category name is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { name: "Audio", isActive: false }, isSubmitting: true });

    render(<MasterCategoryCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch"));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it.each([
    ["loading", "Loading category data…"],
    ["error", "Unable to load category data. Please try again."],
  ] as const)("should show the %s message instead of the form", (formStatus, message) => {
    render(<MasterCategoryCreateComponent {...createProps({ mode: "edit", formStatus })} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Category" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterCategoryCreateComponent {...createProps({ errorMessage: "Duplicate category" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate category");
  });
});
