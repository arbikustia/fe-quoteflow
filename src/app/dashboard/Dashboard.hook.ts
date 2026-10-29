import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllVouchersQuery } from "@/services/master-voucher.service";
import { mapOrder, useGetOrdersQuery } from "@/services/order.service";
import { mapQuotation, useGetQuotationsQuery } from "@/services/quotation.service";

import { DASHBOARD_MENU_ITEMS } from "./Dashboard.config";
import type { DashboardAssets, DashboardNavigation, DashboardOrder, DashboardOrderState, DashboardQuotationChartDatum, DashboardQuotationState, DashboardRoute, DashboardVoucherState } from "./Dashboard.type";
import BannerApp from "../../assets/banner-app.png";

/**
 * Manage dashboard menu navigation.
 * @returns {DashboardNavigation} Navigation handler
 */
export const useDashboardNavigation = (): DashboardNavigation => {
  const navigate = useNavigate();
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
  const isLoading = carouselQuery.isLoading || carouselQuery.isFetching || chartQuery.isLoading || chartQuery.isFetching;

  if (isLoading) {
    return { isLoading: true, quotations: [], chartData: [] };
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
    const count = chartSource.filter((quotation) => {
      const createdAt = new Date(quotation.created_at);
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

  return { isLoading: false, quotations, chartData };
};

/**
 * Load three active orders and order creation chart data for dashboard.
 * @returns {DashboardOrderState} Order loading state, carousel items, and chart data
 */
export const useDashboardOrders = (): DashboardOrderState => {
  const carouselQuery = useGetOrdersQuery({
    pageNumber: 1,
    pageSize: 3,
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  const chartQuery = useGetOrdersQuery({
    pageNumber: 1,
    pageSize: 1000,
    type: "",
    status: "",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });
  const isLoading = carouselQuery.isLoading || carouselQuery.isFetching || chartQuery.isLoading || chartQuery.isFetching;

  if (isLoading) {
    return { isLoading: true, orders: [], chartData: [] };
  }

  const carouselData = carouselQuery.data?.status && Array.isArray(carouselQuery.data.data)
    ? carouselQuery.data.data
    : [];
  const chartSource = chartQuery.data?.status && Array.isArray(chartQuery.data.data)
    ? chartQuery.data.data
    : [];

  const orders: DashboardOrder[] = carouselData.map((order) => {
    const mapped = mapOrder(order);

    return {
      id: mapped.id,
      eventName: mapped.name,
      customerName: order.customer_name ?? "-",
      startDate: mapped.startDate,
      endDate: mapped.endDate,
      grandTotal: mapped.grandTotal,
      status: mapped.status,
      createdAt: order.created_at,
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

  return { isLoading: false, orders, chartData };
};

export const useDashboardAssets = (): DashboardAssets => {
  const [isAssetLoading, setIsAssetLoading] = useState(true);
  const voucherState = useDashboardVouchers();

  useEffect(() => {
    let isMounted = true;
    const sources = [BannerApp, ...DASHBOARD_MENU_ITEMS.map((item) => item.icon)];
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
