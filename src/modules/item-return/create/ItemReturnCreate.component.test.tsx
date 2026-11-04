import { MemoryRouter } from "react-router-dom";

import test, { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemReturnCreateForm } from "./ItemReturnCreate.component";
import type { ReturnCreateFormState } from "./ItemReturnCreate.type";

const mockEmptyFormProps: ReturnCreateFormState = {
  orderOptions: [{ value: "order-1", label: "PT Customer — ORD-001" }],
  isOrdersLoading: false,
  isLoadingInitialData: false,
  isEditMode: false,
  selectedOrderId: "",
  orderItems: [],
  filteredOrderItems: [],
  returnItemIds: [],
  uploadingItemId: null,
  photoPreview: null,
  stagedPhotoUrls: new Map(),
  viewedPhoto: null,
  openPhoto: jest.fn(),
  closeViewedPhoto: jest.fn(),
  confirmPhoto: jest.fn(),
  closePhotoPreview: jest.fn(),
  returnDate: "",
  returnNotes: "",
  searchTerm: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleSearchChange: jest.fn(),
  handleDateChange: jest.fn(),
  handleNotesChange: jest.fn(),
  onCaptureItem: jest.fn(),
  onItemConditionChange: jest.fn(),
  onItemNotesChange: jest.fn(),
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
    condition: "Good",
    notes: "",
    fileUrl: "",
    fileName: "",
  },
  {
    id: "itm-2-0",
    itemId: "itm-2",
    itemName: "Microphone Wireless",
    category: "Audio",
    qty: 2,
    unit: "units",
    condition: "Good",
    notes: "",
    fileUrl: "",
    fileName: "",
  },
];

const mockSelectedFormProps: ReturnCreateFormState = {
  orderOptions: [{ value: "order-1", label: "PT Customer — ORD-001" }],
  isOrdersLoading: false,
  isLoadingInitialData: false,
  isEditMode: false,
  selectedOrderId: "order-1",
  orderItems: mockOrderItems,
  filteredOrderItems: mockOrderItems,
  returnItemIds: ["itm-1-0"],
  uploadingItemId: null,
  photoPreview: null,
  stagedPhotoUrls: new Map(),
  viewedPhoto: null,
  openPhoto: jest.fn(),
  closeViewedPhoto: jest.fn(),
  confirmPhoto: jest.fn(),
  closePhotoPreview: jest.fn(),
  returnDate: "2026-11-03",
  returnNotes: "Catatan pengembalian",
  searchTerm: "",
  isSubmitting: false,
  errorMessage: null,
  handleOrderChange: jest.fn(),
  handleSearchChange: jest.fn(),
  handleDateChange: jest.fn(),
  handleNotesChange: jest.fn(),
  onCaptureItem: jest.fn(),
  onItemConditionChange: jest.fn(),
  onItemNotesChange: jest.fn(),
  handleSave: jest.fn(),
  goBack: jest.fn(),
};

describe("ItemReturnCreateForm", () => {
  it("should render rental order select and no table when unselected", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockEmptyFormProps} />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Rental Order")).toBeInTheDocument();
    expect(screen.queryByText("Order Items")).not.toBeInTheDocument();
  });

  it("should render order items table, search filter, and checkboxes when order is selected", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Order Items")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
    expect(screen.getAllByText("Speaker Active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Microphone Wireless").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Save Return" })).toBeInTheDocument();
  });

  it("should edit return and item remarks in mobile textareas and desktop text inputs", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} />
      </MemoryRouter>,
    );

    const mobileReturnRemark = screen.getByLabelText("Return Remark", { selector: "textarea" });
    const desktopReturnRemark = screen.getByLabelText("Return Remark", { selector: "input" });
    const mobileItemRemarks = screen.getAllByLabelText("Remark", { selector: "textarea" });
    const desktopItemRemark = screen.getByLabelText("Remark for Speaker Active", { selector: "input" });
    expect(mobileReturnRemark).toHaveValue("Catatan pengembalian");
    expect(desktopReturnRemark).toHaveValue("Catatan pengembalian");
    fireEvent.change(mobileReturnRemark, { target: { value: "Late return" } });
    fireEvent.change(desktopReturnRemark, { target: { value: "Complete return" } });
    fireEvent.change(mobileItemRemarks[0], { target: { value: "Damaged case" } });
    fireEvent.change(desktopItemRemark, { target: { value: "Working" } });
    expect(mockSelectedFormProps.handleNotesChange).toHaveBeenCalledWith("Late return");
    expect(mockSelectedFormProps.handleNotesChange).toHaveBeenCalledWith("Complete return");
    expect(mockSelectedFormProps.onItemNotesChange).toHaveBeenCalledWith("itm-1-0", "Damaged case");
    expect(mockSelectedFormProps.onItemNotesChange).toHaveBeenCalledWith("itm-1-0", "Working");
  });

  it("should trigger search change on input", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} />
      </MemoryRouter>,
    );
    const searchInput = screen.getByPlaceholderText("Search items...");
    fireEvent.change(searchInput, { target: { value: "Speaker" } });
    expect(mockSelectedFormProps.handleSearchChange).toHaveBeenCalledWith("Speaker");
  });

  it("should display camera input instead of checkbox in edit mode", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} isEditMode={true} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("button", { name: "Update Return" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    const cameraInputs = screen.getAllByLabelText("Take photo for Speaker Active");
    expect(cameraInputs[0]).toHaveAttribute("capture", "environment");
    const photo = new File(["photo"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(cameraInputs[0], { target: { files: [photo] } });
    expect(mockSelectedFormProps.onCaptureItem).toHaveBeenCalledWith("itm-1-0", photo);
  });

  it("should preview captured photo and wait for confirmation before staging", () => {
    render(<MemoryRouter><ItemReturnCreateForm {...mockSelectedFormProps} photoPreview={{ itemId: "itm-1-0", itemName: "Speaker Active", url: "blob:preview" }} /></MemoryRouter>);

    expect(screen.getByRole("img", { name: "Captured return for Speaker Active" })).toHaveAttribute("src", "blob:preview");
    fireEvent.click(screen.getByRole("button", { name: "Save photo for return" }));
    expect(mockSelectedFormProps.confirmPhoto).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(mockSelectedFormProps.closePhotoPreview).toHaveBeenCalled();
  });

  it("should open saved photo in modal instead of a new tab", () => {
    const props = {
      ...mockSelectedFormProps,
      stagedPhotoUrls: new Map([["itm-1-0", "blob:staged"]]),
      viewedPhoto: { itemName: "Speaker Active", url: "blob:staged" },
    };
    render(<MemoryRouter><ItemReturnCreateForm {...props} /></MemoryRouter>);

    expect(screen.queryByRole("link", { name: "View photo" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Return photo for Speaker Active" })).toHaveAttribute("src", "blob:staged");
    fireEvent.click(screen.getAllByRole("button", { name: "View photo" })[0]);
    expect(mockSelectedFormProps.openPhoto).toHaveBeenCalledWith("itm-1-0");
    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    expect(mockSelectedFormProps.closeViewedPhoto).toHaveBeenCalled();
  });

  it("should trigger save on button click", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save Return" }));
    expect(mockSelectedFormProps.handleSave).toHaveBeenCalled();
  });

  it("should trigger cancel on cancel button click", () => {
    render(
      <MemoryRouter>
        <ItemReturnCreateForm {...mockSelectedFormProps} />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockSelectedFormProps.goBack).toHaveBeenCalled();
  });
});

it("ItemReturnCreateForm matches snapshot", () => {
  test.assertSnapshots(ItemReturnCreateForm, [
    { props: mockEmptyFormProps, desc: "renders unselected form" },
    { props: mockSelectedFormProps, desc: "renders selected order with table and search" },
  ]);
});
