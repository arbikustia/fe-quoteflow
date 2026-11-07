import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { getCalendarMonthRange, mapCalendarItemToEvent } from "@/modules/calendar/Calendar.helpers";
import { useGetCalendarEventsQuery } from "@/services/calendar.service";
import { useGetInvoicesQuery } from "@/services/invoice.service";
import { useGetAllVouchersQuery, useGetVouchersQuery } from "@/services/master-voucher.service";
import { useGetPaymentsQuery } from "@/services/payment.service";
import { mapQuotation, useGetQuotationsQuery } from "@/services/quotation.service";
import { mapRentalOrder, useGetRentalOrdersQuery } from "@/services/rental-order.service";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import type { DashboardAssets, DashboardNavigation, DashboardOrder, DashboardOrderChartDatum, DashboardOrderState, DashboardOverviewState, DashboardQuotationChartDatum, DashboardQuotationState, DashboardRentalOrderRange, DashboardRoute, DashboardVoucherState } from "./Dashboard.type";
import BannerApp from "../../assets/banner-app.png";

/**
 * Manage dashboard menu navigation.
 * @returns {DashboardNavigation} Navigation handler
 */
export const useDashboardNavigation = (): DashboardNavigation => {
  const navigate = useNavigate();
  const { logView } = useMasterActivityLog("Home");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const navigateTo = useCallback((route: DashboardRoute): void => {
    navigate(route);
  }, [navigate]);

  const navigateToQuotation = useCallback((id: string): void => {
    navigate(`/document/quotation/${id}`);
  }, [navigate]);

  const navigateToOrder = useCallback((id: string): void => {
    navigate(`/order/detail/${id}`);
  }, [navigate]);

  return { navigateTo, navigateToQuotation, navigateToOrder };
};

/**
 * Load active voucher count for dashboard promotion.
 * @returns {DashboardVoucherState} Voucher loading state and count
 */
export const useDashboardVouchers = (): DashboardVoucherState => {
  const queryResult = useGetAllVouchersQuery();

  if (queryResult.isLoading) {
    return { isLoading: true, count: null };
  }

  if (queryResult.isError || !queryResult.data?.status || !Array.isArray(queryResult.data.data)) {
    return { isLoading: false, count: null };
  }

  return {
    isLoading: false,
    count: queryResult.data.data.filter((voucher) => voucher.status === 1).length,
  };
};

/**
 * Preload dashboard image assets and return loading state.
 * @returns {DashboardAssets} Asset loading state
 */
/**
 * Load three active quotations for dashboard carousel.
 * @returns {DashboardQuotationState} Quotation loading state and items
 */
export const useDashboardQuotations = (): DashboardQuotationState => {
  const carouselQuery = useGetQuotationsQuery({ pageNumber: 1, pageSize: 3, searchTerm: "" });
  const chartQuery = useGetQuotationsQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const calendarQuery = useGetCalendarEventsQuery(getCalendarMonthRange(new Date()));
  const isLoading = carouselQuery.isLoading || carouselQuery.isFetching || chartQuery.isLoading || chartQuery.isFetching || calendarQuery.isLoading;

  if (isLoading) {
    return { isLoading: true, quotations: [], chartData: [], calendarEvents: [] };
  }

  const carouselData = carouselQuery.data?.status && Array.isArray(carouselQuery.data.data)
    ? carouselQuery.data.data
    : [];
  const chartSource = chartQuery.data?.status && Array.isArray(chartQuery.data.data)
    ? chartQuery.data.data
    : [];
  const quotations = carouselData.map((quotation) => {
    const mapped = mapQuotation(quotation);
    return {
      id: mapped.id,
      quotationNumber: mapped.quotationNumber,
      customerName: mapped.customerName,
      eventName: mapped.name,
      startDate: mapped.startDate,
      endDate: mapped.endDate,
      grandTotal: mapped.grandTotal,
      status: mapped.status,
      createdAt: quotation.created_at,
    };
  });
  const today = new Date();
  const chartData: DashboardQuotationChartDatum[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));
    const count = chartSource.filter((order) => {
      const createdAt = new Date(order.created_at);
      return !Number.isNaN(createdAt.getTime())
        && createdAt.getFullYear() === date.getFullYear()
        && createdAt.getMonth() === date.getMonth()
        && createdAt.getDate() === date.getDate();
    }).length;

    return {
      label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      count,
    };
  });

  const calendarEvents = calendarQuery.data?.status && Array.isArray(calendarQuery.data.data)
    ? calendarQuery.data.data.map(mapCalendarItemToEvent)
    : [];

  return {
    isLoading: false,
    quotations,
    chartData,
    calendarEvents,
  };
};

/**
 * Load rental orders for mobile dashboard carousel.
 * @returns {DashboardOrderState} Rental order loading state and items
 */
export const useDashboardOrders = (): DashboardOrderState => {
  const query = useGetRentalOrdersQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });

  if (query.isLoading || query.isFetching) {
    return { isLoading: true, isError: false, orders: [], chartData: [] };
  }

  if (query.isError || !query.data?.status || !Array.isArray(query.data.data)) {
    return { isLoading: false, isError: true, orders: [], chartData: [] };
  }

  const allOrders = query.data.data;
  const orders: DashboardOrder[] = allOrders.slice(0, 3).map((order) => {
    const mapped = mapRentalOrder(order);

    return {
      id: mapped.transactionId,
      eventName: mapped.eventName,
      customerName: mapped.customerName,
      startDate: mapped.startDate,
      endDate: mapped.endDate,
      grandTotal: mapped.grandTotal,
      status: mapped.status,
      createdAt: order.created_at,
    };
  });

  const today = new Date();
  const chartData: DashboardOrderChartDatum[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));
    const count = allOrders.filter((order) => {
      const createdAt = new Date(order.created_at);

      return !Number.isNaN(createdAt.getTime())
        && createdAt.getFullYear() === date.getFullYear()
        && createdAt.getMonth() === date.getMonth()
        && createdAt.getDate() === date.getDate();
    }).length;

    return {
      label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      count,
    };
  });

  return { isLoading: false, isError: false, orders, chartData };
};

/** Format date for dashboard API query. */
const _formatDashboardDate = (date: Date): string => `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`;

/** Get current dashboard rental-order date range. */
const _getDashboardRange = (): DashboardRentalOrderRange => {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo);
  dateFrom.setDate(dateTo.getDate() - 30);

  return { dateFrom: _formatDashboardDate(dateFrom), dateTo: _formatDashboardDate(dateTo), label: `${dateFrom.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${dateTo.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}` };
};

/** Load desktop dashboard overview data. */
export const useDashboardOverview = (): DashboardOverviewState => {
  const quotationQuery = useGetQuotationsQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const invoiceQuery = useGetInvoicesQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const paymentQuery = useGetPaymentsQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const voucherQuery = useGetVouchersQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const range = _getDashboardRange();
  const rentalOrderQuery = useGetRentalOrdersQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });
  const quotations = quotationQuery.data?.data ?? [];
  const invoices = invoiceQuery.data?.data ?? [];
  const payments = paymentQuery.data?.data ?? [];
  const vouchers = voucherQuery.data?.data ?? [];
  const rentalOrderResponse = rentalOrderQuery.data;
  const rentalOrders = rentalOrderResponse?.status ? rentalOrderResponse.data : [];
  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - 30);
  const chartOrders = rentalOrders.filter((order) => {
    const createdAt = new Date(order.created_at);

    return !Number.isNaN(createdAt.getTime()) && createdAt >= rangeStart;
  });
  const chartData = rentalOrderResponse?.status
    ? {
      total_orders: chartOrders.length,
      total_amount: chartOrders.reduce(
        (sum, order) => sum + (order.invoice?.quotation?.transaction?.grand_total ?? 0),
        0,
      ),
    }
    : null;

  return {
    isLoading: quotationQuery.isLoading || invoiceQuery.isLoading || paymentQuery.isLoading || voucherQuery.isLoading,
    isChartLoading: rentalOrderQuery.isLoading || rentalOrderQuery.isFetching,
    isChartError: rentalOrderQuery.isError || (Boolean(rentalOrderQuery.data) && !rentalOrderQuery.data.status),
    chartDateFrom: range.dateFrom,
    chartDateTo: range.dateTo,
    quotationCount: quotationQuery.data?.total_count ?? quotations.length,
    invoiceCount: invoiceQuery.data?.total_count ?? invoices.length,
    paymentCount: paymentQuery.data?.total_count ?? payments.length,
    voucherCount: voucherQuery.data?.total_count ?? vouchers.length,
    quotationValue: quotations.reduce((sum, item) => sum + item.transaction.grand_total, 0),
    invoiceValue: invoices.reduce((sum, item) => sum + item.quotation.transaction.grand_total, 0),
    paymentValue: payments.reduce((sum, item) => sum + item.amount, 0),
    trend: chartData ? [{ label: range.label, totalOrders: chartData.total_orders, totalAmount: chartData.total_amount }] : [],
  };
};

export const useDashboardAssets = (): DashboardAssets => {
  const [isAssetLoading, setIsAssetLoading] = useState(true);
  const voucherState = useDashboardVouchers();

  useEffect(() => {
    let isMounted = true;
    const sources = [BannerApp, ...DASHBOARD_MENU_ITEMS.flatMap((item) => (item.icon ? [item.icon] : []))];
    let loadedCount = 0;

    const checkComplete = (): void => {
      loadedCount += 1;
      if (loadedCount >= sources.length && isMounted) {
        setIsAssetLoading(false);
      }
    };

    sources.forEach((src) => {
      const img = new Image();

      img.src = src;
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        img.onerror = checkComplete;
      }
    });

    return (): void => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading: isAssetLoading,
    voucherCount: voucherState.count,
  };
};
