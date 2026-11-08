import test from "@/libs/unit-test";

import { QuotationComponent } from "./Quotation.component";
import type { QuotationProps } from "./Quotation.type";

jest.useFakeTimers();
jest.setSystemTime(new Date("2026-10-25T00:00:00.000Z"));

afterAll(() => jest.useRealTimers());

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>),
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: jest.fn(({ children, title }: { children: React.ReactNode; title: string }): React.ReactElement => (
    <section><h1>{title}</h1>{children}</section>
  )),
}));

jest.mock("@/services/master-item.service", () => ({
  useGetAllItemsQuery: jest.fn((): { data: { status: boolean; data: [] } } => ({ data: { status: true, data: [] } })),
}));

/**
 * Resolve download callback.
 * @returns {Promise<void>} Resolved promise
 */
const onDownload = (): Promise<void> => Promise.resolve();

/**
 * No-op callback.
 * @returns {void} - no value.
 */
const noop = (): void => undefined;

const dummyProps: QuotationProps = {
  itemCategories: new Map(),
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
  onDownload,
  onEdit: noop,
  onDetail: noop,
  onStatus: noop,
  onRowClick: noop,
};

test.assertSnapshots(QuotationComponent, [
  { props: dummyProps, desc: "renders QuotationComponent with data" },
  { props: { ...dummyProps, isLoading: true, paginatedData: [] }, desc: "renders QuotationComponent in loading state" },
]);
