import type { ChangeEvent } from "react";

import { MOCK_API_ITEMS } from "@/fixture/master-item";
import { act, renderHook } from "@/libs/unit-test";

import { useMasterItem } from "./MasterItem.hook";
import type { ItemData } from "./MasterItem.type";
import { downloadItemLabel, downloadItemQrPdf } from "./MasterItem.util";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("./MasterItem.util", () => ({
  downloadItemLabel: jest.fn(() => Promise.resolve()),
  downloadItemQrPdf: jest.fn(() => Promise.resolve()),
}));

/**
 * Build a list row for an item id.
 * @param {string} id - Item id
 * @returns {ItemData} - List row
 */
const createItem = (id: string): ItemData => ({
  id,
  name: `Item ${id}`,
  categoryName: "Audio",
  price: 1000,
  stock: 1,
  duration: 1,
  image: null,
  remark: "-",
  status: "active",
  source: { ...MOCK_API_ITEMS[0], id },
});

/**
 * Build a search input change event.
 * @param {string} value - Input value
 * @returns {ChangeEvent<HTMLInputElement>} - Change event
 */
const createSearchEvent = (value: string): ChangeEvent<HTMLInputElement> => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("useMasterItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should page, resize and search from the first page", () => {
    const { result } = renderHook(useMasterItem);

    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 10, searchTerm: "" });

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageChange(0));
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.handlePageChange(3));
    act(() => result.current.handlePageSizeChange(20));
    act(() => result.current.handlePageChange(2));
    act(() => result.current.handleSearchChange(createSearchEvent("beam")));
    expect(result.current.queryParams).toEqual({ pageNumber: 1, pageSize: 20, searchTerm: "beam" });
  });

  it("should navigate to master main, create and edit with the raw item", () => {
    const { result } = renderHook(useMasterItem);
    const item = createItem("item-1");

    act(result.current.handleBack);
    act(result.current.handleCreate);
    act(() => result.current.handleEdit(item));

    expect(mockNavigate.mock.calls).toEqual([
      ["/master-main"],
      ["/master-item/create"],
      ["/master-item/edit/item-1", { state: { item: item.source } }],
    ]);
  });

  it("should select items, download them as one PDF and reset on cancel", () => {
    const { result } = renderHook(useMasterItem);
    const first = createItem("item-1");
    const second = createItem("item-2");

    act(result.current.handleDownloadSelected);
    expect(downloadItemQrPdf).not.toHaveBeenCalled();

    act(result.current.handleStartMultiDownload);
    act(() => result.current.handleToggleItem(first));
    act(() => result.current.handleToggleItem(second));
    act(() => result.current.handleToggleItem(first));
    expect(result.current.isMultiDownloadMode).toBe(true);
    expect(result.current.selectedItemIds).toEqual(["item-2"]);

    act(result.current.handleDownloadSelected);
    expect(downloadItemQrPdf).toHaveBeenCalledWith([second]);

    act(result.current.handleCancelMultiDownload);
    expect(result.current.isMultiDownloadMode).toBe(false);
    expect(result.current.selectedItemIds).toEqual([]);
  });

  it("should download one item label in the chosen format", () => {
    const { result } = renderHook(useMasterItem);
    const item = createItem("item-1");

    act(() => result.current.handleDownload(item, "image"));

    expect(downloadItemLabel).toHaveBeenCalledWith(item, "image");
  });
});
