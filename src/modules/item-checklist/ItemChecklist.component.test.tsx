import { MemoryRouter } from "react-router-dom";

import test, { fireEvent, render, screen } from "@/libs/unit-test";
import { ItemChecklistComponent } from "./ItemChecklist.component";
import type { ChecklistListState } from "./ItemChecklist.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, headerRight, title }: { children: React.ReactNode; headerRight: React.ReactNode; title: string }) => (
    <section><h1>{title}</h1>{headerRight}{children}</section>
  ),
}));

const mockProps: ChecklistListState = {
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
  rows: [
    {
      id: "chk-1",
      checklistNo: "CHK-001",
      customerName: "PT Customer",
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
    expect(screen.getAllByText("Item Checklist List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CHK-001")).toHaveLength(2);
    expect(screen.getByText("Create Item Checklist")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create New" })).toBeInTheDocument();
    expect(screen.getAllByText("Done")[0]).toHaveClass("border-current", "px-3", "py-1", "text-base", "uppercase");
    expect(screen.getByRole("columnheader", { name: "Customer Name" })).toBeInTheDocument();
  });

  it("should trigger onCreate from mobile header and desktop toolbar", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Create New" }));
    fireEvent.click(screen.getByRole("button", { name: "Create Item Checklist" }));
    expect(mockProps.onCreate).toHaveBeenCalledTimes(2);
  });

  it("should open detail when desktop row is clicked", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByText("CHK-001")[1]);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.rows[0]);
  });

  it("should match quotation mobile card hierarchy and open detail", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    const title = screen.getAllByText("CHK-001")[0];
    const card = title.closest("button");
    expect(card).toHaveClass("rounded-3xl", "border-border-strong", "bg-background-surface", "shadow-small");
    expect(title).toHaveClass("text-xl");
    expect(card?.querySelectorAll(".text-xs, .text-sm")).toHaveLength(0);
    expect(card?.querySelector(".text-base")).toHaveTextContent("Done");
    expect(card).toHaveTextContent("2 items");
    expect(card).toHaveTextContent("Checklist date");
    fireEvent.click(title);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.rows[0]);
  });

  it("should number desktop rows using current page", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} currentPage={2} /></MemoryRouter>);
    expect(screen.getByRole("cell", { name: "11" })).toBeInTheDocument();
  });

  it("should show unavailable status inside card", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} rows={[{ ...mockProps.rows[0], status: "unavailable" }]} /></MemoryRouter>);
    expect(screen.getAllByText("Pending")).toHaveLength(2);
    expect(screen.queryByText("ord-1")).not.toBeInTheDocument();
  });

  it("should render card skeleton on mobile and table skeleton on desktop while loading", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} isLoading={true} /></MemoryRouter>);
    const cards = screen.getAllByRole("status", { name: "Loading item checklist card" });
    expect(cards).toHaveLength(5);
    expect(cards[0]).toHaveClass("rounded-3xl", "border-border-strong", "shadow-small");
    const table = screen.getByRole("status", { name: "Loading item checklist table" });
    expect(table.querySelectorAll("thead th")).toHaveLength(7);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelectorAll("tbody tr:first-child td")).toHaveLength(7);
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
  test.assertSnapshots(ItemChecklistComponent, [
    { props: mockProps, desc: "renders with mock rows" },
    { props: { ...mockProps, isLoading: true, rows: [] }, desc: "renders responsive skeletons" },
  ]);
});
