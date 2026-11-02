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
  onDownload: jest.fn(),
  isDownloadingId: null,
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
  beforeEach(() => { jest.clearAllMocks(); });

  it("should render table data and header", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    expect(screen.getAllByText("CHK-001")).toHaveLength(2);
    expect(screen.getByText("Create Checklist")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Create" })).toHaveLength(2);
  });

  it("should trigger onCreate from mobile header and desktop toolbar", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("button", { name: "Create" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Checklist" }));
    expect(mockProps.onCreate).toHaveBeenCalledTimes(2);
  });

  it("should open detail when desktop row is clicked", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByText("CHK-001")[1]);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.rows[0]);
  });

  it("should match quotation mobile card typography and open detail", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    const title = screen.getAllByText("CHK-001")[0];
    expect(title).toHaveClass("text-2xl");
    expect(title.nextElementSibling).toHaveClass("text-xl");
    expect(screen.getByText("2 items").parentElement).toHaveClass("text-lg");
    fireEvent.click(title);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.rows[0]);
  });

  it("should show unavailable status inside card", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} rows={[{ ...mockProps.rows[0], status: "unavailable" }]} /></MemoryRouter>);
    expect(screen.getByText("Status unavailable")).toBeInTheDocument();
  });

  it("should render card skeleton on mobile and table skeleton on desktop while loading", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} isLoading={true} /></MemoryRouter>);
    expect(screen.getByLabelText("Loading cards")).toBeInTheDocument();
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("should trigger onEdit directly when desktop edit button is clicked", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    const editButton = screen.getByRole("button", { name: "Edit CHK-001" });
    fireEvent.click(editButton);
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockProps.rows[0]);
    expect(mockProps.onRowClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Download PDF CHK-001" })).toBeInTheDocument();
  });

  it("should download PDF from table action without opening detail", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Download PDF CHK-001" }));
    expect(mockProps.onDownload).toHaveBeenCalledWith(mockProps.rows[0]);
    expect(mockProps.onRowClick).not.toHaveBeenCalled();
  });

  it("should disable download while another checklist is downloading", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} isDownloadingId="chk-1" /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Download PDF CHK-001" })).toBeDisabled();
  });
});

it("ItemChecklistComponent matches snapshot", () => {
  test.assertSnapshots(ItemChecklistComponent, [{ props: mockProps, desc: "renders with mock rows" }]);
});
