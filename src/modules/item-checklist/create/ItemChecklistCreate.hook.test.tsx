import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

import type { ApiChecklist } from "../ItemChecklist.type";
import { useItemChecklistCreate } from "./ItemChecklistCreate.hook";

const mockUpdate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });
const mockCreate = jest.fn().mockResolvedValue({ data: { status: true, messages: [], data: null } });

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
jest.mock("@/services/rental-order.service", () => ({
  useGetRentalOrderOptionsQuery: () => ({ data: { status: true, data: [] }, isLoading: false }),
}));
jest.mock("@/services/master-item.service", () => ({
  useGetAllItemsQuery: () => ({ data: { status: true, data: [] } }),
}));

const EditRoute = ({ children }: { children: ReactNode }): ReactNode => (
  <MemoryRouter initialEntries={["/document/item-checklist/create/checklist-1"]}>
    <Routes>
      <Route path="/document/item-checklist/create/:id" element={children} />
      <Route path="/document/item-checklist" element={children} />
    </Routes>
  </MemoryRouter>
);

describe("useItemChecklistCreate edit mode", () => {
  beforeEach(() => {
    mockUpdate.mockClear();
    mockCreate.mockClear();
  });

  it("should load saved flags and update checklist without checklist_date", async () => {
    const { result } = renderHook(() => ({ form: useItemChecklistCreate(), location: useLocation() }), { wrapper: EditRoute });
    await waitFor(() => expect(result.current.form.moveOutItemIds).toEqual(["entry-1"]));
    expect(result.current.form.moveInItemIds).toEqual(["entry-2"]);
    expect(result.current.form.isEditMode).toBe(true);

    act(() => result.current.form.onToggleMoveIn("entry-1"));
    await act(async () => { await result.current.form.handleSave(); });

    expect(mockUpdate).toHaveBeenCalledWith({
      id: "checklist-1",
      body: {
        order_id: "order-1",
        status: 1,
        items: [
          { item_id: "item-1", description: "Speaker description", qty: 2, move_out: true, move_in: true, sign: "PIC" },
          { item_id: "item-2", description: "Microphone description", qty: 1, move_out: false, move_in: true, sign: "PIC" },
        ],
      },
    });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(result.current.location.pathname).toBe("/document/item-checklist");
    expect(result.current.form.errorMessage).toBeNull();
  });
});
