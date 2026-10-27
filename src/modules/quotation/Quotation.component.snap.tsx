import test from "@/libs/unit-test";

import { QuotationComponent } from "./Quotation.component";
import type { QuotationProps } from "./Quotation.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-25T00:00:00.000Z"));

afterAll(() => jest.useRealTimers());

/**
 * No-op callback.
 * @returns {void} - no value.
 */
const noop = (): void => undefined;

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
      customerName: "PT Example",
      name: "Event Test",
      quotationDate: "2026-10-01",
      customerPhone: "0812345678",
      location: "Jakarta",
      startDate: "2026-11-01",
      endDate: "2026-11-02",
      grandTotal: 5000000,
      status: 1,
    },
  ],
  isLoading: false,
  errorMessage: null,
  isMissingData: false,
  isEmpty: false,
  /**
   *
   */
  goToPage: () => {},
  /**
   *
   */
  changePageSize: () => {},
  /**
   *
   */
  setSearchTerm: () => {},
  /**
   *
   */
  onBack: noop,
  onEdit: noop,
  onDetail: noop,
  onStatus: noop,
  onRowClick: noop,
};

test.assertSnapshots(QuotationComponent, [
  { props: dummyProps, desc: "renders QuotationComponent with data" },
]);
