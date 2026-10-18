import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render } from "@testing-library/react";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { getColumns } from "./MasterItem.columns";
import type { ItemData } from "./MasterItem.type";

describe("MasterItem.columns", () => {
  const mockOnEdit = jest.fn();
  const mockOnDownload = jest.fn();
  const mockOnToggleItem = jest.fn();

  const mockItem: ItemData = {
    id: "item-1",
    name: "Wireless Mic",
    categoryId: "cat-1",
    categoryName: "Audio",
    price: 150000,
    stock: 10,
    image: "https://example.com/images/mic.png",
    duration: 1,
    remark: "Good condition",
    status: "active",
    createAt: "2026-01-01",
    createBy: "Admin",
  };

  const defaultParams = {
    currentPage: 1,
    pageSize: 10,
    isMultiDownloadMode: false,
    selectedItemIds: [] as string[],
    onToggleItem: mockOnToggleItem,
    onEdit: mockOnEdit,
    onDownload: mockOnDownload,
  };

  it("should return standard 10 columns when multi download is disabled", () => {
    const columns = getColumns(defaultParams);

    expect(columns).toHaveLength(10);
    expect(columns.map((column) => column.key)).toEqual([
      "no",
      "image",
      "name",
      "categoryName",
      "price",
      "stock",
      "duration",
      "status",
      "remark",
      "actions",
    ]);
  });

  it("should include selection column first when multi download is enabled", () => {
    const columns = getColumns({
      ...defaultParams,
      isMultiDownloadMode: true,
      selectedItemIds: ["item-1"],
    });

    expect(columns).toHaveLength(11);
    expect(columns[0].key).toBe("select");

    const selectColumn = columns[0];
    const element = selectColumn.render?.(mockItem, 0);
    const { container } = render(React.createElement(MemoryRouter, null, element));
    const checkbox = container.querySelector("input[type='checkbox']") as HTMLInputElement;

    expect(checkbox).not.toBeNull();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.getAttribute("aria-label")).toBe("Select Wireless Mic");

    fireEvent.click(checkbox);
    expect(mockOnToggleItem).toHaveBeenCalledWith(mockItem);
  });

  it("should calculate correct 1-based index based on page and pageSize", () => {
    const columns = getColumns({
      ...defaultParams,
      currentPage: 3,
      pageSize: 5,
    });
    const noColumn = columns.find((column) => column.key === "no");
    const element = noColumn?.render?.(mockItem, 2);
    const { container } = render(React.createElement(MemoryRouter, null, element));

    expect(container.textContent).toBe("13");
  });

  it("should render image file name with external link or dash when empty", () => {
    const columns = getColumns(defaultParams);
    const imageColumn = columns.find((column) => column.key === "image");

    const withImage = imageColumn?.render?.(mockItem, 0);
    const { container: containerWithImg } = render(
      React.createElement(MemoryRouter, null, withImage),
    );
    const link = containerWithImg.querySelector("a");

    expect(link?.textContent).toBe("mic.png");
    expect(link?.getAttribute("href")).toBe(mockItem.image);

    const withoutImage = imageColumn?.render?.({ ...mockItem, image: null }, 0);
    const { container: containerNoImg } = render(
      React.createElement(MemoryRouter, null, withoutImage),
    );

    expect(containerNoImg.textContent).toBe("-");
  });

  it("should format currency price with Indonesian Rupiah locale", () => {
    const columns = getColumns(defaultParams);
    const priceColumn = columns.find((column) => column.key === "price");
    const formatted = priceColumn?.render?.(mockItem, 0);

    expect(formatted).toBe("Rp 150.000");
  });

  it("should render status badge for active and inactive status", () => {
    const columns = getColumns(defaultParams);
    const statusColumn = columns.find((column) => column.key === "status");

    const activeEl = statusColumn?.render?.(mockItem, 0);
    const { container: containerActive } = render(
      React.createElement(MemoryRouter, null, activeEl),
    );

    expect(containerActive.textContent).toBe("active");
    expect(containerActive.firstElementChild?.className).toContain("bg-green-100");

    const inactiveEl = statusColumn?.render?.({ ...mockItem, status: "inactive" }, 0);
    const { container: containerInactive } = render(
      React.createElement(MemoryRouter, null, inactiveEl),
    );

    expect(containerInactive.textContent).toBe("inactive");
    expect(containerInactive.firstElementChild?.className).toContain("bg-red-100");
  });

  it("should trigger onEdit when edit button is clicked", () => {
    const columns = getColumns(defaultParams);
    const actionsColumn = columns.find((column) => column.key === "actions");
    const element = actionsColumn?.render?.(mockItem, 0);
    const { container } = render(React.createElement(MemoryRouter, null, element));

    const editBtn = container.querySelector("button[title='Edit']") as HTMLButtonElement;
    fireEvent.click(editBtn);

    expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
  });

  it("should trigger onDownload when format is chosen from dropdown", () => {
    const columns = getColumns(defaultParams);
    const actionsColumn = columns.find((column) => column.key === "actions");
    const element = actionsColumn?.render?.(mockItem, 0);
    const { container } = render(React.createElement(MemoryRouter, null, element));

    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "pdf" } });

    expect(mockOnDownload).toHaveBeenCalledWith(mockItem, "pdf");
    expect(select.value).toBe("");
  });
});
