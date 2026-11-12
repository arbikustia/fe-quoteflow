import test from "@/libs/unit-test";

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

describe("ItemChecklistCreateForm snapshot", () => {
  test.assertSnapshots(ItemChecklistCreateForm, [
    { props: mockEmptyFormProps, desc: "should render unselected form" },
    { props: mockSelectedFormProps, desc: "should render selected order with table and search" },
    { props: { ...mockSelectedFormProps, isEditMode: true, highlightedRowId: "itm-1-0" }, desc: "should render edit mode with highlighted row" },
  ]);
});
