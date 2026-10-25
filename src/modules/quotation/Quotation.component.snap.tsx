import test from "@/libs/unit-test";

import { getColumns } from "./Quotation.columns";
import { QuotationComponent } from "./Quotation.component";
import type { QuotationProps } from "./Quotation.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-25T00:00:00.000Z"));

afterAll(() => jest.useRealTimers());

const dummyProps: QuotationProps = {
  currentPage: 1,
  pageSize: 10,
  totalPages: 1,
  totalCount: 1,
  paginatedData: [
    {
      id: "q-1",
      transactionId: "tx-1",
      quotationNumber: "QUO-001",
      name: "Event Test",
      customerPhone: "0812345678",
      location: "Jakarta",
      startDate: "2026-11-01",
      endDate: "2026-11-02",
      grandTotal: 5000000,
    },
  ],
  isLoading: false,
  errorMessage: null,
  isMissingData: false,
  isEmpty: false,
  goToPage: () => {},
  changePageSize: () => {},
  setSearchTerm: () => {},
  onBack: () => {},
  onEdit: () => {},
  onRowClick: () => {},
  columns: getColumns({ currentPage: 1, pageSize: 10, onEdit: () => {} }),
};

test.assertSnapshots(QuotationComponent, [
  { props: dummyProps, desc: "renders QuotationComponent with data" },
]);
