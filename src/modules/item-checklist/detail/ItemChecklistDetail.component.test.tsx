import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemChecklistDetailComponent } from "./ItemChecklistDetail.component";
import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title, onBack, headerRight }: { children: React.ReactNode; title: string; onBack: () => void; headerRight: React.ReactNode }) => (
    <section>
      <h1>{title}</h1>
      <button onClick={onBack}>Back</button>
      {headerRight}
      {children}
    </section>
  ),
}));

const mockProps: ItemChecklistDetailState = {
  checklist: {
    id: "chk-1",
    order_id: "ord-1",
    checklist_no: "CI20261101210842",
    checklist_date: "2026-11-01 21:08:54",
    status: null,
    created_at: "2026-11-01 21:08:55",
    updated_at: "2026-11-01 21:08:55",
    items: [{
      id: "item-1",
      checklist_id: "chk-1",
      item_id: "master-item-1",
      item_name: "Beam 290",
      description: "Beam 290 description",
      section: null,
      qty: 1,
      move_out: true,
      move_in: false,
      sign: "Putri",
      remark: null,
      status: null,
      created_at: "2026-11-01 21:08:55",
      updated_at: "2026-11-01 21:08:55",
    }],
  },
  isLoading: false,
  errorMessage: null,
  goBack: jest.fn(),
  goEdit: jest.fn(),
  onDownload: jest.fn(),
};

describe("ItemChecklistDetailComponent", () => {
  it("should show checklist metadata and item details with nullable fields", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Item Checklist Detail", level: 1 })).not.toBeNull();
    expect(screen.getAllByText("CI20261101210842").length).toBeGreaterThan(0);
    expect(screen.queryByText("ord-1")).toBeNull();
    expect(screen.queryByText("Order ID")).toBeNull();
    expect(screen.getAllByText("Unavailable").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beam 290").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beam 290 description").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beam 290 description")[0].className).toContain("text-lg");
    expect(screen.getByText("Checklist date").className).toContain("text-lg");
    expect(screen.getByText("Qty 1").className).toContain("text-lg");
    expect(screen.getAllByText("Putri").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("should navigate to edit from the three-dot menu", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByLabelText("More options")[0]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "Edit Checklist" })[0]);
    expect(mockProps.goEdit).toHaveBeenCalled();
  });

  it("should trigger download from the three-dot menu", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByLabelText("More options")[0]);
    fireEvent.click(screen.getAllByRole("menuitem", { name: "Download PDF" })[0]);
    expect(mockProps.onDownload).toHaveBeenCalled();
  });

  it("should show an error instead of checklist data when request fails", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} errorMessage="Unable to load item checklist." /></MemoryRouter>);
    expect(screen.getByRole("alert").textContent).toContain("Unable to load item checklist.");
    expect(screen.queryByText("Beam 290")).toBeNull();
  });

  it("should show loading and empty states", () => {
    const { rerender } = render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} isLoading={true} /></MemoryRouter>);

    expect(screen.queryByText("Beam 290")).toBeNull();
    rerender(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} checklist={null} /></MemoryRouter>);
    expect(screen.queryByText("Beam 290")).toBeNull();
  });
});
