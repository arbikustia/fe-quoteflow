import { MOCK_API_ITEMS } from "@/fixture/master-item";
import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterItemComponent from "./MasterItem.component";
import type { ItemData, MasterItemProps } from "./MasterItem.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const ITEM: ItemData = {
  id: "item-1",
  name: "Beam 290",
  categoryName: "Lighting Equipment",
  price: 100000,
  stock: 7,
  duration: 1,
  image: null,
  remark: "Lighting",
  status: "active",
  source: MOCK_API_ITEMS[0],
};

/**
 * Build list view props.
 * @param {Partial<MasterItemProps>} [overrides] - Props to override
 * @returns {MasterItemProps} - Component props
 */
const createProps = (overrides?: Partial<MasterItemProps>): MasterItemProps => ({
  listStatus: "ready",
  items: [ITEM],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  selectedItemIds: [],
  isMultiDownloadMode: false,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onToggleItem: jest.fn(),
  onStartMultiDownload: jest.fn(),
  onCancelMultiDownload: jest.fn(),
  onDownload: jest.fn(),
  onDownloadSelected: jest.fn(),
  ...overrides,
});

describe("MasterItemComponent", () => {
  it("should render items in the table and mobile cards", () => {
    render(<MasterItemComponent {...createProps()} />);

    expect(screen.getAllByText("Beam 290")).toHaveLength(2);
    expect(screen.getByText("Lighting")).toBeInTheDocument();
  });

  it("should call create, search and edit handlers", () => {
    const props = createProps();

    render(<MasterItemComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Item" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search item")[0], { target: { value: "beam" } });
    fireEvent.click(screen.getByRole("button", { name: "Edit item Beam 290" }));

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
    expect(props.onEdit).toHaveBeenCalledWith(ITEM);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterItemComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Item" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit item Beam 290" })).not.toBeInTheDocument();
  });

  it("should start multi-download mode", () => {
    const props = createProps();

    render(<MasterItemComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Download Multiple" }));

    expect(props.onStartMultiDownload).toHaveBeenCalledTimes(1);
  });

  it("should download or cancel the selection in multi-download mode", () => {
    const props = createProps({ isMultiDownloadMode: true, selectedItemIds: ["item-1"] });

    render(<MasterItemComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Download Multiple (1)" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("checkbox", { name: "Select Beam 290" })).toBeChecked();
    expect(props.onDownloadSelected).toHaveBeenCalledTimes(1);
    expect(props.onCancelMultiDownload).toHaveBeenCalledTimes(1);
  });

  it("should disable the batch download without a selection", () => {
    render(<MasterItemComponent {...createProps({ isMultiDownloadMode: true })} />);

    expect(screen.getByRole("button", { name: "Download Multiple (0)" })).toBeDisabled();
  });

  it("should render skeletons while loading", () => {
    const { container } = render(<MasterItemComponent {...createProps({ listStatus: "loading", items: [] })} />);

    expect(screen.queryByText("Beam 290")).not.toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it.each([
    ["empty", "No items found."],
    ["error", "Unable to load items."],
    ["missing", "Item data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterItemComponent {...createProps({ listStatus, items: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterItemComponent {...createProps({ successMessage: "Item created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Item created successfully.");
  });
});
