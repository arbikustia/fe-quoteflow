import { MemoryRouter } from "react-router-dom";

import test, { fireEvent, render, screen } from "@/libs/unit-test";
import { ItemChecklistComponent } from "./ItemChecklist.component";
import type { ChecklistListState } from "./ItemChecklist.type";

const mockProps: ChecklistListState = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  rows: [
    {
      id: "chk-1",
      checklistNo: "CHK-001",
      checklistDate: "2026-11-01T07:01:19.094Z",
      itemCount: 2,
      status: "active",
      orderId: "ord-1",
    },
  ],
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onCreate: jest.fn(),
  onRowClick: jest.fn(),
  onEdit: jest.fn(),
  onBack: jest.fn(),
};

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-11-01T07:00:00.000Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("ItemChecklistComponent", () => {
  it("should render table data and header", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    expect(screen.getAllByText("CHK-001")).toHaveLength(2);
    expect(screen.getAllByText("Create Checklist")).toHaveLength(2);
  });

  it("should trigger onCreate when clicked", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByText("Create Checklist")[0]);
    expect(mockProps.onCreate).toHaveBeenCalled();
  });

  it("should edit selected checklist without opening detail", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("button", { name: "Edit CHK-001" })[1]);
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockProps.rows[0]);
    expect(mockProps.onRowClick).not.toHaveBeenCalled();
  });
});

it("ItemChecklistComponent matches snapshot", () => {
  test.assertSnapshots(ItemChecklistComponent, [{ props: mockProps, desc: "renders with mock rows" }]);
});
