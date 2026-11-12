import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemChecklistCreateForm } from "./ItemChecklistCreate.component";
import type { ChecklistCreateFormState } from "./ItemChecklistCreate.type";

const mockEmptyFormProps: ChecklistCreateFormState = {
  orderOptions: [{ value: "order-1", label: "PT Customer — ORD-001" }],
  isOrdersLoading: false,
  isLoadingInitialData: false,
  isEditMode: false,
  selectedOrderId: "",
  focusAt: "moveOut",
  orderItems: [],
  filteredOrderItems: [],
  moveOutItemIds: [],
  moveInItemIds: [],
  searchTerm: "",
  highlightedRowId: "",
  notFoundItemCode: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleFocusAtChange: jest.fn(),
  handleSearchChange: jest.fn(),
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
  focusAt: "moveOut",
  orderItems: mockOrderItems,
  filteredOrderItems: mockOrderItems,
  moveOutItemIds: ["itm-1-0"],
  moveInItemIds: [],
  searchTerm: "",
  highlightedRowId: "",
  notFoundItemCode: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleFocusAtChange: jest.fn(),
  handleSearchChange: jest.fn(),
  handleSave: jest.fn(),
  goBack: jest.fn(),
};

describe("ItemChecklistCreateForm", () => {
  it("should render rental order select and master role actions when unselected", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockEmptyFormProps} /></MemoryRouter>);
    expect(screen.getByLabelText("Rental Order")).not.toBeNull();
    expect(screen.getByLabelText("Focus At")).not.toBeNull();
    expect(screen.queryByText("Order Items")).toBeNull();
    expect(screen.getByRole("button", { name: "Cancel" }).className).toContain("h-14");
    expect(screen.getByRole("button", { name: "Save Checklist" }).className).toContain("h-14");
  });

  it("should render order items table, search filter, and checkboxes when order is selected", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    expect(screen.getByText("Order Items")).not.toBeNull();
    expect(screen.getByPlaceholderText("Search items...")).not.toBeNull();
    expect(screen.getAllByText("Speaker Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Microphone Wireless").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Save Checklist" })).not.toBeNull();
    const mobileItem = screen.getAllByText("Speaker Active")[0].closest("article");
    expect(mobileItem?.querySelectorAll(".text-xs, .text-sm, .text-base")).toHaveLength(0);
    expect(screen.getByText("Select Move Out and Move In independently for each item.").className).toContain("text-base");
    screen.getAllByRole("checkbox", { name: "Move out Speaker Active" }).forEach((checkbox) => {
      expect(checkbox.closest("label")?.className).toContain("[&_.ant-checkbox]:h-7!");
    });
  });

  it("should trigger search change on input", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    const searchInput = screen.getByPlaceholderText("Search items...");
    fireEvent.change(searchInput, { target: { value: "Speaker" } });
    expect(mockSelectedFormProps.handleSearchChange).toHaveBeenCalledWith("Speaker");
  });

  it("should display edit state with scan-only disabled move checkboxes", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} isEditMode={true} moveInItemIds={["itm-2-0"]} /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Update Checklist" })).not.toBeNull();
    expect(screen.queryByRole("combobox", { name: "Rental Order" })).toBeNull();
    expect(screen.getAllByRole("checkbox", { name: "Move out Speaker Active" })).toHaveLength(2);
    expect(screen.getAllByRole("checkbox", { name: "Move in Microphone Wireless" })).toHaveLength(2);
    screen.getAllByRole("checkbox", { name: "Move out Speaker Active" }).forEach((checkbox) => expect((checkbox as HTMLInputElement).checked).toBe(true));
    screen.getAllByRole("checkbox", { name: "Move in Microphone Wireless" }).forEach((checkbox) => expect((checkbox as HTMLInputElement).checked).toBe(true));
    screen.getAllByRole("checkbox").forEach((checkbox) => expect((checkbox as HTMLInputElement).disabled).toBe(true));
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Move in Speaker Active" })[0]);
    screen.getAllByRole("checkbox", { name: "Move in Speaker Active" }).forEach((checkbox) => expect((checkbox as HTMLInputElement).checked).toBe(false));
  });

  it("should highlight scanned row and show not found badge", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} highlightedRowId="itm-1-0" notFoundItemCode="UNKNOWN-1" /></MemoryRouter>);
    expect(screen.getByRole("alert").textContent).toContain("Item \"UNKNOWN-1\" not found");
    expect(screen.getAllByText("Speaker Active")[0].closest("article")?.className).toContain("motion-safe:animate-scan-success");
    expect(screen.getAllByText("Speaker Active")[1].closest("tr")?.className).toContain("motion-safe:animate-scan-success");
    expect(screen.getAllByText("Microphone Wireless")[1].closest("tr")?.className).not.toContain("motion-safe:animate-scan-success");
  });

  it("should trigger save on button click", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Save Checklist" }));
    expect(mockSelectedFormProps.handleSave).toHaveBeenCalled();
  });

  it("should show loading skeleton while initial data loads", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} isLoadingInitialData={true} /></MemoryRouter>);

    expect(screen.queryByText("Order Items")).toBeNull();
  });

  it("should show error message and empty search text", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} errorMessage="Failed" filteredOrderItems={[]} searchTerm="zzz" /></MemoryRouter>);

    expect(screen.getByText("Failed")).not.toBeNull();
    expect(screen.getAllByText("No items matching search.").length).toBeGreaterThan(0);
  });

  it("should trigger cancel", () => {
    render(<MemoryRouter><ItemChecklistCreateForm {...mockSelectedFormProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSelectedFormProps.goBack).toHaveBeenCalled();
  });
});
