import { act, renderHook } from "@/libs/unit-test";
import { useGetCalendarEventsQuery } from "@/services/calendar.service";
import { useGetInvoicesQuery } from "@/services/invoice.service";
import { useGetAllVouchersQuery, useGetVouchersQuery } from "@/services/master-voucher.service";
import { useGetPaymentsQuery } from "@/services/payment.service";
import { useGetQuotationsQuery } from "@/services/quotation.service";
import { useGetRentalOrdersQuery } from "@/services/rental-order.service";

import { DASHBOARD_COUNT_QUERY, DASHBOARD_ORDER_QUERY } from "./Dashboard.config";
import { useDashboardAssetLoading, useDashboardCalendar, useDashboardMenuItems, useDashboardNavigation, useDashboardOrders, useDashboardOverview, useDashboardVoucherCount } from "./Dashboard.hook";

const mockNavigate = jest.fn();
const mockLogView = jest.fn();
const mockPermission = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: (): jest.Mock => mockNavigate,
}));
jest.mock("@/hooks/useMasterActivityLog", () => ({ useMasterActivityLog: (): { logView: jest.Mock } => ({ logView: mockLogView }) }));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (url: string): { canView: boolean } => mockPermission(url) as { canView: boolean } }));
jest.mock("@/services/calendar.service", () => ({ useGetCalendarEventsQuery: jest.fn() }));
jest.mock("@/services/invoice.service", () => ({ useGetInvoicesQuery: jest.fn() }));
jest.mock("@/services/master-voucher.service", () => ({ useGetAllVouchersQuery: jest.fn(), useGetVouchersQuery: jest.fn() }));
jest.mock("@/services/payment.service", () => ({ useGetPaymentsQuery: jest.fn() }));
jest.mock("@/services/quotation.service", () => ({ useGetQuotationsQuery: jest.fn() }));
jest.mock("@/services/rental-order.service", () => ({ useGetRentalOrdersQuery: jest.fn() }));
jest.mock("@/modules/calendar/Calendar.util", () => ({
  getCalendarMonthRange: (): { start: string; end: string } => ({ start: "s", end: "e" }),
  mapCalendarItemToEvent: (item: { id: string }): { id: string } => ({ id: item.id }),
}));

const mockOrders = jest.mocked(useGetRentalOrdersQuery);
const mockAllVouchers = jest.mocked(useGetAllVouchersQuery);
const mockCalendar = jest.mocked(useGetCalendarEventsQuery);

describe("Dashboard.hook", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();
    mockLogView.mockResolvedValue(undefined);
  });

  describe("useDashboardNavigation", (): void => {
    it("should log the view once and navigate to a route", (): void => {
      const { result } = renderHook(() => useDashboardNavigation());

      act((): void => result.current.navigateTo("/calendar"));

      expect(mockLogView).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/calendar");
    });
  });

  describe("useDashboardMenuItems", (): void => {
    it("should hide denied pages and show Master Data when one child page is allowed", (): void => {
      mockPermission.mockImplementation((url: string) => ({ canView: url === "/master-customer" }));

      const { result } = renderHook(() => useDashboardMenuItems());

      expect(result.current.map((item) => item.label)).toEqual(["Master Data"]);
    });

    it("should return every item when all pages are allowed", (): void => {
      mockPermission.mockReturnValue({ canView: true });

      const { result } = renderHook(() => useDashboardMenuItems());

      expect(result.current).toHaveLength(8);
    });
  });

  describe("useDashboardVoucherCount", (): void => {
    it("should count active vouchers", (): void => {
      mockAllVouchers.mockReturnValue({ isError: false, data: { status: true, data: [{ status: 1 }, { status: 0 }] } } as never);

      const { result } = renderHook(() => useDashboardVoucherCount());

      expect(result.current).toBe(1);
    });

    it("should return null on error or while loading", (): void => {
      mockAllVouchers.mockReturnValue({ isError: true } as never);

      const { result } = renderHook(() => useDashboardVoucherCount());

      expect(result.current).toBeNull();
    });
  });

  describe("useDashboardOverview", (): void => {
    it("should query one row per page and expose totals", (): void => {
      const ok = { isLoading: false, data: { total_count: 7 } };

      jest.mocked(useGetQuotationsQuery).mockReturnValue(ok as never);
      jest.mocked(useGetInvoicesQuery).mockReturnValue({ isLoading: false, data: { total_count: 3 } } as never);
      jest.mocked(useGetPaymentsQuery).mockReturnValue({ isLoading: false, data: undefined } as never);
      jest.mocked(useGetVouchersQuery).mockReturnValue({ isLoading: false, data: { total_count: 1 } } as never);

      const { result } = renderHook(() => useDashboardOverview());

      expect(useGetQuotationsQuery).toHaveBeenCalledWith(DASHBOARD_COUNT_QUERY);
      expect(result.current).toEqual({ isLoading: false, counts: { quotation: 7, invoice: 3, payment: 0, voucher: 1 } });
    });

    it("should report loading while any query loads", (): void => {
      jest.mocked(useGetQuotationsQuery).mockReturnValue({ isLoading: true } as never);
      jest.mocked(useGetInvoicesQuery).mockReturnValue({ isLoading: false } as never);
      jest.mocked(useGetPaymentsQuery).mockReturnValue({ isLoading: false } as never);
      jest.mocked(useGetVouchersQuery).mockReturnValue({ isLoading: false } as never);

      const { result } = renderHook(() => useDashboardOverview());

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("useDashboardCalendar", (): void => {
    it("should map calendar items to events", (): void => {
      mockCalendar.mockReturnValue({ isLoading: false, data: { status: true, data: [{ id: "e1" }] } } as never);

      const { result } = renderHook(() => useDashboardCalendar());

      expect(result.current).toEqual({ isLoading: false, events: [{ id: "e1" }] });
    });

    it("should return no events when the API reports failure", (): void => {
      mockCalendar.mockReturnValue({ isLoading: true, data: undefined } as never);

      const { result } = renderHook(() => useDashboardCalendar());

      expect(result.current).toEqual({ isLoading: true, events: [] });
    });
  });

  describe("useDashboardOrders", (): void => {
    it("should build the seven-day chart", (): void => {
      mockOrders.mockReturnValue({ isLoading: false, isFetching: false, isError: false, data: { status: true, data: [{ created_at: new Date().toISOString() }] } } as never);

      const { result } = renderHook(() => useDashboardOrders());

      expect(mockOrders).toHaveBeenCalledWith(DASHBOARD_ORDER_QUERY);
      expect(result.current.isError).toBe(false);
      expect(result.current.chartData).toHaveLength(7);
      expect(result.current.chartData[6].count).toBe(1);
    });

    it("should report loading while fetching", (): void => {
      mockOrders.mockReturnValue({ isLoading: false, isFetching: true } as never);

      const { result } = renderHook(() => useDashboardOrders());

      expect(result.current).toEqual({ isLoading: true, isError: false, chartData: [] });
    });

    it("should report API error instead of empty data", (): void => {
      mockOrders.mockReturnValue({ isLoading: false, isFetching: false, isError: true } as never);

      const { result } = renderHook(() => useDashboardOrders());

      expect(result.current).toEqual({ isLoading: false, isError: true, chartData: [] });
    });
  });

  describe("useDashboardAssetLoading", (): void => {
    const OriginalImage = global.Image;

    afterEach((): void => {
      global.Image = OriginalImage;
    });

    it("should stop loading once every image settles", (): void => {
      const instances: { onload: () => void }[] = [];

      global.Image = class {
        complete = false;
        onload: () => void = (): void => {};
        onerror: () => void = (): void => {};
        src = "";

        constructor() {
          instances.push(this);
        }
      } as never;

      const { result } = renderHook(() => useDashboardAssetLoading());

      expect(result.current).toBe(true);

      act((): void => instances.forEach((image) => image.onload()));

      expect(result.current).toBe(false);
    });

    it("should stop loading immediately when images are already cached", (): void => {
      global.Image = class {
        complete = true;
        src = "";
      } as never;

      const { result } = renderHook(() => useDashboardAssetLoading());

      expect(result.current).toBe(false);
    });
  });
});
