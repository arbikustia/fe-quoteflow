import { fireEvent, render, screen } from "@/libs/unit-test";

import { _createEditClickHandler, getCategoryColumns, getCategoryRowKey, renderCategoryMobileCard } from "./MasterCategory.helper";
import type { CategoryData } from "./MasterCategory.type";

const CATEGORY: CategoryData = { id: "1", categoryName: "Audio System", status: "inactive", createdAt: "01 Februari 2024" };

describe("MasterCategory helper", () => {
  it("should call edit without bubbling the click", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    _createEditClickHandler(CATEGORY, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(CATEGORY);
  });

  it("should build columns with the edit action when allowed", () => {
    const onEdit = jest.fn();
    const columns = getCategoryColumns(2, 10, true, onEdit);

    expect(columns.map((column) => column.key)).toEqual(["no", "categoryName", "status", "createAt", "actions"]);

    render(<div>{columns.map((column) => <div key={column.key}>{column.render?.(CATEGORY, 0)}</div>)}</div>);

    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    fireEvent.click(screen.getByRole("button", { name: "Edit category" }));
    expect(onEdit).toHaveBeenCalledWith(CATEGORY);
  });

  it("should hide the action column without edit permission", () => {
    expect(getCategoryColumns(1, 10, false, jest.fn()).map((column) => column.key)).not.toContain("actions");
  });

  it("should use the category id as the row key", () => {
    expect(getCategoryRowKey(CATEGORY)).toBe("1");
  });

  it("should render a mobile card that opens edit when allowed", () => {
    const onEdit = jest.fn();

    render(renderCategoryMobileCard({ category: CATEGORY, canEdit: true, onEdit }));
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("01 Februari 2024")).toBeInTheDocument();
    expect(onEdit).toHaveBeenCalledWith(CATEGORY);
  });

  it("should disable the mobile card without edit permission", () => {
    render(renderCategoryMobileCard({ category: CATEGORY, canEdit: false, onEdit: jest.fn() }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
