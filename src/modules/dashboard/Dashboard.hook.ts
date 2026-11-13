import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";
import { usePagePermission } from "@/hooks/usePagePermission";

import { DASHBOARD_BANNER, DASHBOARD_COUNT_QUERY, DASHBOARD_MENU_ITEMS, DASHBOARD_ORDER_QUERY } from "./Dashboard.config";
import type { DashboardCalendarState, DashboardMenuItem, DashboardNavigation, DashboardOrderState, DashboardOverviewState, DashboardRoute } from "./Dashboard.type";
import { buildOrderChartData, countActiveVouchers, filterMenuItems, getTotalCount } from "./Dashboard.util";

import { getCalendarMonthRange, mapCalendarItemToEvent } from "@/modules/calendar/Calendar.util";
import { useGetCalendarEventsQuery } from "@/services/calendar.service";
import { useGetInvoicesQuery } from "@/services/invoice.service";
import { useGetAllVouchersQuery, useGetVouchersQuery } from "@/services/master-voucher.service";
import { useGetPaymentsQuery } from "@/services/payment.service";
import { useGetQuotationsQuery } from "@/services/quotation.service";
import { useGetRentalOrdersQuery } from "@/services/rental-order.service";

/**
 * Manage dashboard navigation and log the page view once.
 * @returns {DashboardNavigation} - Navigation handler
 */
export const useDashboardNavigation = (): DashboardNavigation => {
  const navigate = useNavigate();
  const { logView } = useMasterActivityLog("Home");

  useEffect(() => {
    void logView();
  }, [logView]);

  /**
   * Navigate to a dashboard route.
   * @param {DashboardRoute} route - Target route
   * @returns {void}
   */
  const navigateTo = useCallback((route: DashboardRoute): void => {
    navigate(route);
  }, [navigate]);

  return { navigateTo };
};

/**
 * Resolve the menu items the current user may open.
 * @returns {DashboardMenuItem[]} - Permitted menu items
 */
export const useDashboardMenuItems = (): DashboardMenuItem[] => {
  const { canView: canViewOrder } = usePagePermission("/order/create");
  const { canView: canViewDocument } = usePagePermission("/document");
  const { canView: canViewChecklist } = usePagePermission("/item-checklist");
  const { canView: canViewReturn } = usePagePermission("/item-return");
  const { canView: canViewMaster } = usePagePermission("/master-main");
  const { canView: canViewCustomer } = usePagePermission("/master-customer");
  const { canView: canViewCategory } = usePagePermission("/master-category");
  const { canView: canViewItem } = usePagePermission("/master-item");
  const { canView: canViewProject } = usePagePermission("/master-project");
  const { canView: canViewPaymentMethod } = usePagePermission("/master-payment-method");
  const { canView: canViewVoucher } = usePagePermission("/master-voucher");
  const { canView: canViewRole } = usePagePermission("/master-role");
  const { canView: canViewUser } = usePagePermission("/master-user");
  const { canView: canViewPic } = usePagePermission("/master-pic");
  const { canView: canViewOrderType } = usePagePermission("/master-order-type");
  const { canView: canViewEmailSender } = usePagePermission("/master-email-sender");
  const { canView: canViewMail } = usePagePermission("/mail");
  const { canView: canViewReport } = usePagePermission("/report");
  const { canView: canViewLog } = usePagePermission("/activity-log");
  const hasMasterAccess = [
    canViewMaster, canViewCustomer, canViewCategory, canViewItem, canViewProject, canViewPaymentMethod,
    canViewVoucher, canViewRole, canViewUser, canViewPic, canViewOrderType, canViewEmailSender,
  ].some(Boolean);

  return useMemo(() => filterMenuItems(DASHBOARD_MENU_ITEMS, {
    "/order/create": canViewOrder,
    "/document": canViewDocument,
    "/item-checklist": canViewChecklist,
    "/item-return": canViewReturn,
    "/master-main": hasMasterAccess,
    "/mail": canViewMail,
    "/report": canViewReport,
    "/activity-log": canViewLog,
  }), [canViewOrder, canViewDocument, canViewChecklist, canViewReturn, hasMasterAccess, canViewMail, canViewReport, canViewLog]);
};

/**
 * Load the active voucher count for the promotion banner.
 * @returns {number | null} - Active voucher count, null while loading or on error
 */
export const useDashboardVoucherCount = (): number | null => {
  const { data, isError } = useGetAllVouchersQuery();

  if (isError || !data?.status || !Array.isArray(data.data)) {
    return null;
  }

  return countActiveVouchers(data.data);
};

/**
 * Preload banner and menu icons.
 * @returns {boolean} - True while images are loading
 */
export const useDashboardAssetLoading = (): boolean => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const sources = [DASHBOARD_BANNER, ...DASHBOARD_MENU_ITEMS.map((item) => item.icon)];
    let loadedCount = 0;

    /**
     * Mark one image as settled and finish when all are.
     * @returns {void}
     */
    const handleSettled = (): void => {
      loadedCount += 1;

      if (loadedCount >= sources.length && isMounted) {
        setIsLoading(false);
      }
    };

    sources.forEach((source) => {
      const image = new Image();

      image.src = source;

      if (image.complete) {
        handleSettled();

        return;
      }

      image.onload = handleSettled;
      image.onerror = handleSettled;
    });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return isLoading;
};

/**
 * Load record totals for the desktop metric cards.
 * @returns {DashboardOverviewState} - Loading flag and totals
 */
export const useDashboardOverview = (): DashboardOverviewState => {
  const quotationQuery = useGetQuotationsQuery(DASHBOARD_COUNT_QUERY);
  const invoiceQuery = useGetInvoicesQuery(DASHBOARD_COUNT_QUERY);
  const paymentQuery = useGetPaymentsQuery(DASHBOARD_COUNT_QUERY);
  const voucherQuery = useGetVouchersQuery(DASHBOARD_COUNT_QUERY);

  return {
    isLoading: quotationQuery.isLoading || invoiceQuery.isLoading || paymentQuery.isLoading || voucherQuery.isLoading,
    counts: {
      quotation: getTotalCount(quotationQuery.data),
      invoice: getTotalCount(invoiceQuery.data),
      payment: getTotalCount(paymentQuery.data),
      voucher: getTotalCount(voucherQuery.data),
    },
  };
};

/**
 * Load current-month calendar events for the preview.
 * @returns {DashboardCalendarState} - Loading flag and events
 */
export const useDashboardCalendar = (): DashboardCalendarState => {
  const { data, isLoading } = useGetCalendarEventsQuery(getCalendarMonthRange(new Date()));

  if (!data?.status || !Array.isArray(data.data)) {
    return { isLoading, events: [] };
  }

  return { isLoading, events: data.data.map(mapCalendarItemToEvent) };
};

/**
 * Load rental orders and derive the seven-day chart.
 * @returns {DashboardOrderState} - Loading flag, error flag and chart data
 */
export const useDashboardOrders = (): DashboardOrderState => {
  const { data, isLoading, isFetching, isError } = useGetRentalOrdersQuery(DASHBOARD_ORDER_QUERY);

  if (isLoading || isFetching) {
    return { isLoading: true, isError: false, chartData: [] };
  }

  if (isError || !data?.status || !Array.isArray(data.data)) {
    return { isLoading: false, isError: true, chartData: [] };
  }

  return { isLoading: false, isError: false, chartData: buildOrderChartData(data.data, new Date()) };
};
