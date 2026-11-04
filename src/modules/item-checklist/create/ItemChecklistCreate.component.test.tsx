import { MemoryRouter } from "react-router-dom";

import test, { fireEvent, render, screen } from "@/libs/unit-test";
import { ItemChecklistCreateForm } from "./ItemChecklistCreate.component";
import type { ChecklistCreateFormState } from "./ItemChecklistCreate.type";

const mockEmptyFormProps: ChecklistCreateFormState = {
  orderOptions: [{ value: "order-1", label: "PT Customer — ORD-001" }],
  isOrdersLoading: false,
  isLoadingInitialData: false,
  isEditMode: false,
  selectedOrderId: "",
  orderItems: [],
  filteredOrderItems: [],
  moveOutItemIds: [],
  moveInItemIds: [],
  searchTerm: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleSearchChange: jest.fn(),
  onToggleMoveOut: jest.fn(),
  onToggleMoveIn: jest.fn(),
  handleSave: jest.fn(),
  goBack: jest.fn(),
};

const mockOrderItems = [
  {
    id: "itm-1-0",
    itemId: "itm-1",
    itemName: "Speaker Active",
    category: "Audio",
    qty: 1,
    unit: "unit",
    moveOut: "",
    moveIn: "",
    sign: "John Doe",
  },
  {
    id: "itm-2-0",
    itemId: "itm-2",
    itemName: "Microphone Wireless",
    category: "Audio",
    qty: 2,
    unit: "units",
    moveOut: "",
    moveIn: "",
    sign: "John Doe",
  },
];

const mockSelectedFormProps: ChecklistCreateFormState = {
  orderOptions: [{ value: "order-1", label: "PT Customer — ORD-001" }],
  isOrdersLoading: false,
  isLoadingInitialData: false,
  isEditMode: false,
  selectedOrderId: "order-1",
  orderItems: mockOrderItems,
  filteredOrderItems: mockOrderItems,
  moveOutItemIds: ["itm-1-0"],
  moveInItemIds: [],
  searchTerm: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleSearchChange: jest.fn(),
  onToggleMoveOut: jest.fn(),
  onToggleMoveIn: jest.fn(),
  handleSave: jest.fn(),
  goBack: jest.fn(),
};

describe("ItemChecklistCreateForm", () => {
  it("should render rental order select and master role actions when unselected", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockEmptyFormProps} /></MemoryRouter>);
    expect(screen.getByLabelText("Rental Order")).toBeInTheDocument();
    expect(screen.queryByText("Order Items")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("h-14", "rounded-xl");
    expect(screen.getByRole("button", { name: "Save Checklist" })).toHaveClass("h-14", "rounded-xl");
  });

  it("should render order items table, search filter, and checkboxes when order is selected", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    expect(screen.getByText("Order Items")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
    expect(screen.getAllByText("Speaker Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Microphone Wireless").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Save Checklist" })).toBeInTheDocument();
    const mobileItem = screen.getAllByText("Speaker Active")[0].closest("article");
    expect(mobileItem?.querySelectorAll(".text-xs, .text-sm, .text-base")).toHaveLength(0);
    expect(screen.getByText("Select Move Out and Move In independently for each item.")).toHaveClass("text-base");
  });

  it("should trigger search change on input", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    const searchInput = screen.getByPlaceholderText("Search items...");
    fireEvent.change(searchInput, { target: { value: "Speaker" } });
    expect(mockSelectedFormProps.handleSearchChange).toHaveBeenCalledWith("Speaker");
  });

  it("should display edit state with independent move selections", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} isEditMode={true} moveInItemIds={["itm-2-0"]} /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Update Checklist" })).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Rental Order" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("checkbox", { name: "Move out Speaker Active" })).toHaveLength(2);
    expect(screen.getAllByRole("checkbox", { name: "Move in Microphone Wireless" })).toHaveLength(2);
    screen.getAllByRole("checkbox", { name: "Move out Speaker Active" }).forEach((checkbox) => expect(checkbox).toBeChecked());
    screen.getAllByRole("checkbox", { name: "Move in Microphone Wireless" }).forEach((checkbox) => expect(checkbox).toBeChecked());
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Move in Speaker Active" })[0]);
    expect(mockSelectedFormProps.onToggleMoveIn).toHaveBeenCalledWith("itm-1-0");
    expect(mockSelectedFormProps.onToggleMoveOut).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Move out Microphone Wireless" })[0]);
    expect(mockSelectedFormProps.onToggleMoveOut).toHaveBeenCalledWith("itm-2-0");
    expect(mockSelectedFormProps.onToggleMoveIn).toHaveBeenCalledTimes(1);
  });

  it("should trigger save on button click", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Save Checklist" }));
    expect(mockSelectedFormProps.handleSave).toHaveBeenCalled();
  });
});

it("ItemChecklistCreateForm matches snapshot", () => {
  test.assertSnapshots(ItemChecklistCreateForm, [
    { props: mockEmptyFormProps, desc: "renders unselected form" },
    { props: mockSelectedFormProps, desc: "renders selected order with table and search" },
  ]);
});
