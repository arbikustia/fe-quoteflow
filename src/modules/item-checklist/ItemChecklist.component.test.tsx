import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

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
      checklistDate: "2026-11-01T08:00:00",
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

describe("ItemChecklistComponent", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("should render table data and header", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} rows={[{ ...mockProps.rows[0], status: "inactive" }]} /></MemoryRouter>);
    expect(screen.getAllByText("Item Checklist List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CHK-001")).toHaveLength(2);
    expect(screen.getByText("Create Item Checklist")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Create New" })).not.toBeNull();
    expect(screen.getAllByText("On Progress")[0].className).toContain("uppercase");
    expect(screen.getByRole("columnheader", { name: "Customer Name" })).not.toBeNull();
    expect(screen.getAllByText("PT Customer")).toHaveLength(2);
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
    expect(card?.className).toContain("rounded-3xl");
    expect(title.className).toContain("text-xl");
    expect(card?.querySelectorAll(".text-xs, .text-sm")).toHaveLength(0);
    expect(card?.querySelector(".text-base")?.textContent).toContain("Done");
    expect(card?.textContent).toContain("2 items");
    expect(card?.textContent).toContain("Checklist date");
    fireEvent.click(title);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.rows[0]);
  });

  it("should number desktop rows using current page", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} currentPage={2} /></MemoryRouter>);
    expect(screen.getByRole("cell", { name: "11" })).not.toBeNull();
  });

  it("should show unavailable status inside card", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} rows={[{ ...mockProps.rows[0], status: "unavailable" }]} /></MemoryRouter>);
    expect(screen.getAllByText("Pending")).toHaveLength(2);
    expect(screen.queryByText("ord-1")).toBeNull();
  });

  it("should render card skeleton on mobile and table skeleton on desktop while loading", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} isLoading={true} /></MemoryRouter>);
    const cards = screen.getAllByRole("status", { name: "Loading item checklist card" });
    expect(cards).toHaveLength(5);
    expect(cards[0].className).toContain("rounded-3xl");
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
    expect(screen.getByRole("button", { name: "Download PDF CHK-001" })).not.toBeNull();
  });

  it("should download PDF from table action without opening detail", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Download PDF CHK-001" }));
    expect(mockProps.onDownload).toHaveBeenCalledWith(mockProps.rows[0]);
    expect(mockProps.onRowClick).not.toHaveBeenCalled();
  });

  it("should disable download while another checklist is downloading", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} isDownloadingId="chk-1" /></MemoryRouter>);
    expect((screen.getByRole("button", { name: "Download PDF CHK-001" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("should filter by search term", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} /></MemoryRouter>);
    const inputs = screen.getAllByPlaceholderText("Search item checklist");

    fireEvent.change(inputs[0], { target: { value: "CHK" } });

    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("CHK");
  });

  it("should show error message", () => {
    render(<MemoryRouter><ItemChecklistComponent {...mockProps} errorMessage="Boom" rows={[]} /></MemoryRouter>);

    expect(screen.getAllByText("Boom").length).toBeGreaterThan(0);
  });
});
