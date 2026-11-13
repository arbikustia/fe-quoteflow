import { fireEvent, render, screen } from "@/libs/unit-test";

import { getReturnColumns, ItemReturnMobileCard, renderListState, renderReturnStatus } from "./ItemReturn.helper";
import type { ReturnListState, ReturnRow } from "./ItemReturn.type";

const listProps: ReturnListState = {
  currentPage: 2,
  totalPages: 2,
  pageSize: 10,
  totalCount: 11,
  rows: [],
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
};
const row: ReturnRow = { id: "r-1", customerName: "Cust", returnDate: "2026-11-01T08:00:00", itemCount: 2, notes: "-", status: "unavailable" };

describe("ItemReturn helper", (): void => {
  it("should render status label", (): void => {
    render(renderReturnStatus(row));

    expect(screen.getByText("Status unavailable")).not.toBeNull();
  });

  it("should call onClick from mobile card and show placeholder remark", (): void => {
    const onClick = jest.fn();

    render(<ItemReturnMobileCard row={row} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith(row);
    expect(screen.getByText("No remark")).not.toBeNull();
  });

  it("should build seven columns and render row number", (): void => {
    const columns = getReturnColumns(listProps);

    expect(columns.length).toBe(7);

    render(<>{columns[0].render?.(row, 0)}</>);

    expect(screen.getByText("11")).not.toBeNull();
  });

  it("should return null list state when no error and not empty", (): void => {
    expect(renderListState(listProps)).toBeNull();
  });
});
