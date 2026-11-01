import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { ItemChecklistDetailComponent } from "./ItemChecklistDetail.component";
import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";

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
    expect(screen.getAllByText("CI20261101210842").length).toBeGreaterThan(0);
    expect(screen.queryByText("ord-1")).not.toBeInTheDocument();
    expect(screen.queryByText("Order ID")).not.toBeInTheDocument();
    expect(screen.getAllByText("Unavailable").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beam 290").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beam 290 description").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Putri").length).toBeGreaterThan(0);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("should navigate to edit when action is clicked", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("button", { name: "Edit Checklist" })[0]);
    expect(mockProps.goEdit).toHaveBeenCalled();
  });

  it("should trigger download when Download PDF is clicked", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("button", { name: "Download PDF" })[0]);
    expect(mockProps.onDownload).toHaveBeenCalled();
  });

  it("should show an error instead of checklist data when request fails", () => {
    render(<MemoryRouter><ItemChecklistDetailComponent {...mockProps} errorMessage="Unable to load item checklist." /></MemoryRouter>);
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load item checklist.");
    expect(screen.queryByText("Beam 290")).not.toBeInTheDocument();
  });
});
