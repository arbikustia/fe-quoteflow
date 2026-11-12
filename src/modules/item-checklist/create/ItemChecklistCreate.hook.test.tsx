import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

import type { ApiChecklist } from "../ItemChecklist.type";
import { useItemChecklistCreate } from "./ItemChecklistCreate.hook";

const mockUpdate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });
const mockCreate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });
let mockRentalOrders: unknown[] = [];

const mockChecklist: ApiChecklist = {
  id: "checklist-1",
  order_id: "order-1",
  checklist_no: "CHK-1",
  checklist_date: "2026-11-01",
  status: 1,
  created_at: "2026-11-01",
  updated_at: "2026-11-01",
  items: [
    {
      id: "entry-1",
      checklist_id: "checklist-1",
      item_id: "item-1",
      item_name: "Speaker",
      description: "Speaker description",
      section: "",
      qty: 2,
      move_out: true,
      move_in: false,
      sign: "PIC",
      remark: "",
      status: 1,
      created_at: "2026-11-01",
      updated_at: "2026-11-01",
    },
    {
      id: "entry-2",
      checklist_id: "checklist-1",
      item_id: "item-2",
      item_name: "Microphone",
      description: "Microphone description",
      section: "",
      qty: 1,
      move_out: false,
      move_in: true,
      sign: "PIC",
      remark: "",
      status: 1,
      created_at: "2026-11-01",
      updated_at: "2026-11-01",
    },
  ],
};

jest.mock("@/services/rental-checklist.service", () => ({
  useCreateRentalChecklistMutation: () => [mockCreate, { isLoading: false }],
  useUpdateRentalChecklistMutation: () => [mockUpdate, { isLoading: false }],
  useGetRentalChecklistByIdQuery: () => ({ data: { status: true, data: mockChecklist }, isLoading: false }),
}));
jest.mock("@/services/activity-log.service", () => ({
  useCreateActivityLogMutation: () => [jest.fn().mockResolvedValue({ unwrap: jest.fn() }), { isLoading: false }],
}));
jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrderOptionsQuery: () => ({ data: { status: true, data: mockRentalOrders }, isLoading: false }),
}));
jest.mock("@/services/master-item.service", () => ({
  useGetAllItemsQuery: () => ({ data: { status: true, data: [] } }),
}));

const EditRoute = ({ children }: { children: ReactNode }): ReactNode => (
  <MemoryRouter initialEntries={["/item-checklist/create/checklist-1"]}>
    <Routes>
      <Route path="/item-checklist/create/:id" element={children} />
      <Route path="/item-checklist" element={children} />
    </Routes>
  </MemoryRouter>
);

const CreateRoute = ({ children }: { children: ReactNode }): ReactNode => (
  <MemoryRouter initialEntries={["/item-checklist/create"]}>
    <Routes>
      <Route path="/item-checklist/create" element={children} />
    </Routes>
  </MemoryRouter>
);

describe("useItemChecklistCreate", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockCreate.mockClear();
    mockRentalOrders = [];
  });

  it("should use rental transaction category_name in create form", async () => {
    mockRentalOrders = [{
      id: "order-1",
      order_no: "ORD-001",
      invoice: {
        quotation: {
          transaction: {
            customer_name: "Customer",
            pic: { name: "PIC" },
            rental_transaction_items: [{
              item_id: "item-1",
              item_name: "Speaker",
              category_name: "Sound System",
              qty: 1,
            }],
            rental_transaction_project: [],
          },
        },
      },
    }];
    const { result } = renderHook(() => useItemChecklistCreate(), { wrapper: CreateRoute });

    act(() => result.current.handleOrderChange("order-1"));

    await waitFor(() => expect(result.current.orderItems[0]?.category).toBe("Sound System"));
  });

  it("should scan item ID globally into the selected focus without focusing search", async () => {
    mockRentalOrders = [{
      id: "order-1",
      order_no: "ORD-001",
      invoice: {
        quotation: {
          transaction: {
            customer_name: "Customer",
            pic: { name: "PIC" },
            rental_transaction_items: [{ item_id: "item-1", item_name: "Speaker", qty: 1 }],
            rental_transaction_project: [],
          },
        },
      },
    }];
    const { result } = renderHook(() => useItemChecklistCreate(), { wrapper: CreateRoute });

    act(() => result.current.handleOrderChange("order-1"));
    act(() => result.current.handleFocusAtChange("moveIn"));
    act(() => result.current.handleSearchChange("missing-item"));
    expect(result.current.filteredOrderItems).toHaveLength(0);

    act(() => {
      "item-1".split("").forEach((key) => window.dispatchEvent(new KeyboardEvent("keydown", { key })));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    await waitFor(() => expect(result.current.moveInItemIds).toEqual(["item-1-0"]));
    expect(result.current.highlightedRowId).toBe("item-1-0");
    expect(result.current.notFoundItemCode).toBe("");
    expect(result.current.moveOutItemIds).toEqual([]);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredOrderItems).toHaveLength(1);

    act(() => result.current.handleSearchChange("item-1"));
    expect(result.current.filteredOrderItems).toHaveLength(1);

    act(() => {
      "nope".split("").forEach((key) => window.dispatchEvent(new KeyboardEvent("keydown", { key })));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    await waitFor(() => expect(result.current.notFoundItemCode).toBe("nope"));
    expect(result.current.moveInItemIds).toEqual(["item-1-0"]);
  });

  it("should update checklist with checklist_no and without checklist_date", async () => {
    const { result } = renderHook(() => ({ form: useItemChecklistCreate(), location: useLocation() }), { wrapper: EditRoute });
    await waitFor(() => expect(result.current.form.moveOutItemIds).toEqual(["entry-1"]));
    expect(result.current.form.moveInItemIds).toEqual(["entry-2"]);
    expect(result.current.form.isEditMode).toBe(true);

    act(() => result.current.form.handleFocusAtChange("moveIn"));
    act(() => {
      "item-1".split("").forEach((key) => window.dispatchEvent(new KeyboardEvent("keydown", { key })));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    await waitFor(() => expect(result.current.form.moveInItemIds).toEqual(["entry-2", "entry-1"]));
    await act(async () => { await result.current.form.handleSave(); });

    expect(mockUpdate).toHaveBeenCalledWith({
      id: "checklist-1",
      body: {
        order_id: "order-1",
        checklist_no: "CHK-1",
        status: 1,
        items: [
          { item_id: "item-1", description: "Speaker description", qty: 2, move_out: true, move_in: true, sign: "PIC" },
          { item_id: "item-2", description: "Microphone description", qty: 1, move_out: false, move_in: true, sign: "PIC" },
        ],
      },
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(result.current.location.pathname).toBe("/item-checklist");
    expect(result.current.form.errorMessage).toBeNull();
  });
});
