import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterProjectCreateForm } from "./MasterProjectCreate.component";
import type { MasterProjectCreateFormState } from "@/modules/master-project/MasterProject.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const createProps = (
  overrides: Partial<MasterProjectCreateFormState> = {},
): MasterProjectCreateFormState => ({
  step: 1,
  items: [
    {
      id: "item-1",
      name: "Camera",
      image: "",
      price: 100000,
      stock: 5,
    },
  ],
  selectedItems: [],
  isItemsLoading: false,
  itemsError: null,
  name: "",
  remark: "",
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleRemarkChange: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  toggleItem: jest.fn(),
  updateItemQuantity: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterProjectCreateForm", () => {
  it("should render item selection and handle item toggle", () => {
    const props = createProps();
    render(<MasterProjectCreateForm {...props} />);

    expect(screen.getByRole("heading", { name: "New Project" })).toBeInTheDocument();
    expect(screen.getByText("Camera")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Camera/ }));

    expect(props.toggleItem).toHaveBeenCalledWith(props.items[0]);
  });

  it("should render details step and forward field changes", () => {
    const props = createProps({ step: 2 });
    render(<MasterProjectCreateForm {...props} />);

    fireEvent.change(screen.getByLabelText(/project name/i), { target: { value: "Event Project" } });
    fireEvent.change(screen.getByLabelText(/remark/i), { target: { value: "Outdoor event" } });

    expect(props.handleNameChange).toHaveBeenCalled();
    expect(props.handleRemarkChange).toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: "Back" }).find((button) => button.textContent === "Back")).toBeInTheDocument();
  });

  it("should render preview, messages, and loading submit state", () => {
    const props = createProps({
      step: 3,
      name: "Event Project",
      remark: "Outdoor event",
      selectedItems: [{ ...createProps().items[0], qty: 2 }],
      errorMessage: "Unable to save project.",
      isSubmitting: true,
    });
    render(<MasterProjectCreateForm {...props} />);

    expect(screen.getByText("Event Project")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to save project.");
    expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  });

  it("should match project form snapshot", () => {
    const { asFragment } = render(<MasterProjectCreateForm {...createProps()} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
