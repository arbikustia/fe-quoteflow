import { MOCK_API_ITEMS } from "@/fixture/master-item";
import { fireEvent, render, screen } from "@/libs/unit-test";

import {
  _createDownloadMenuItems,
  _createEditClickHandler,
  _createItemHandler,
  getItemColumns,
  getItemRowKey,
  renderItemMobileCard,
} from "./MasterItem.helper";
import type { ItemColumnParams, ItemData } from "./MasterItem.type";

const ITEM: ItemData = {
  id: "item-1",
  name: "Beam 290",
  categoryName: "Lighting Equipment",
  price: 100000,
  stock: 7,
  duration: 2,
  image: "https://cdn.example.com/beam.jpg",
  remark: "Lighting",
  status: "inactive",
  source: MOCK_API_ITEMS[0],
};

/**
 * Build column params.
 * @param {Partial<ItemColumnParams>} [overrides] - Params to override
 * @returns {ItemColumnParams} - Column params
 */
const createParams = (overrides?: Partial<ItemColumnParams>): ItemColumnParams => ({
  currentPage: 2,
  pageSize: 10,
  canEdit: true,
  isMultiDownloadMode: false,
  selectedItemIds: [],
  onToggleItem: jest.fn(),
  onEdit: jest.fn(),
  onDownload: jest.fn(),
  ...overrides,
});

/**
 * Render every cell of one row.
 * @param {ItemColumnParams} params - Column params
 * @param {ItemData} [item] - Row to render
 * @returns {void}
 */
const renderRow = (params: ItemColumnParams, item: ItemData = ITEM): void => {
  render(<div>{getItemColumns(params).map((column) => <div key={column.key}>{column.render?.(item, 0)}</div>)}</div>);
};

describe("MasterItem helper", () => {
  it("should call edit without bubbling and bind item handlers", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(ITEM, onEdit)({ stopPropagation } as never);
    _createItemHandler(ITEM, onEdit)();

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenNthCalledWith(2, ITEM);
  });

  it("should build an image and PDF download menu", () => {
    const onDownload = jest.fn();
    const menuItems = _createDownloadMenuItems(ITEM, onDownload) as { key: string; label: string; onClick: () => void }[];

    menuItems.forEach((menuItem) => menuItem.onClick());

    expect(menuItems.map((menuItem) => menuItem.label)).toEqual(["Download Image", "Download PDF"]);
    expect(onDownload.mock.calls).toEqual([[ITEM, "image"], [ITEM, "pdf"]]);
  });

  it("should render every cell and the edit action when allowed", () => {
    const params = createParams();

    renderRow(params);
    fireEvent.click(screen.getByRole("button", { name: "Edit item Beam 290" }));

    expect(getItemColumns(params).map((column) => column.key)).toEqual(["no", "image", "name", "categoryName", "price", "stock", "duration", "status", "remark", "actions"]);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("Rp 100.000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See image" })).toHaveAttribute("href", ITEM.image);
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(params.onEdit).toHaveBeenCalledWith(ITEM);
  });

  it("should hide edit without permission but keep the download button", () => {
    renderRow(createParams({ canEdit: false }), { ...ITEM, image: null });

    expect(screen.queryByRole("button", { name: "Edit item Beam 290" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download QR of Beam 290" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "See image" })).not.toBeInTheDocument();
  });

  it("should add a checked selection column in multi-download mode", () => {
    const params = createParams({ isMultiDownloadMode: true, selectedItemIds: ["item-1"] });

    renderRow(params);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Beam 290" }));

    expect(getItemColumns(params)[0].key).toBe("select");
    expect(params.onToggleItem).toHaveBeenCalledWith(ITEM);
  });

  it("should use the item id as the row key", () => {
    expect(getItemRowKey(ITEM)).toBe("item-1");
  });

  it("should render a mobile card that opens edit only when allowed", () => {
    const onEdit = jest.fn();
    const { rerender } = render(renderItemMobileCard({ item: ITEM, canEdit: true, onEdit }));

    fireEvent.click(screen.getByText("Beam 290"));
    expect(screen.getByText("Rp 100.000 · 7 unit · 2 days")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(ITEM);

    rerender(renderItemMobileCard({ item: ITEM, canEdit: false, onEdit }));
    fireEvent.click(screen.getByText("Beam 290"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
