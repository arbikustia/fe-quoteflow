import type * as React from "react";

import test from "@/libs/unit-test";

import { ItemChecklistDetailComponent } from "./ItemChecklistDetail.component";
import type { ItemChecklistDetailState } from "./ItemChecklistDetail.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
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

describe("ItemChecklistDetailComponent snapshot", () => {
  test.assertSnapshots(ItemChecklistDetailComponent, [
    { props: mockProps, desc: "should render checklist detail" },
    { props: { ...mockProps, checklist: null, isLoading: true }, desc: "should render loading state" },
    { props: { ...mockProps, checklist: null, errorMessage: "Unable to load item checklist." }, desc: "should render error state" },
  ]);
});
