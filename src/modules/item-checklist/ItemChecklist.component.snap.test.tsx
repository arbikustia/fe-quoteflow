import type * as React from "react";

import test from "@/libs/unit-test";

import { ItemChecklistComponent } from "./ItemChecklist.component";
import type { ChecklistListState } from "./ItemChecklist.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
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

describe("ItemChecklistComponent snapshot", () => {
  test.assertSnapshots(ItemChecklistComponent, [
    { props: mockProps, desc: "should render checklist rows" },
    { props: { ...mockProps, isLoading: true, rows: [] }, desc: "should render responsive skeletons" },
    { props: { ...mockProps, rows: [], isEmpty: true }, desc: "should render empty state" },
    { props: { ...mockProps, rows: [], errorMessage: "Unable to load item checklists." }, desc: "should render error state" },
  ]);
});
