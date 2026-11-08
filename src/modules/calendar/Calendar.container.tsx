import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { CalendarPageComponent } from "./Calendar.component";
import { useCalendarQuotations } from "./Calendar.hook";

/**
 * Container managing quotation calendar page.
 * @returns {ReactElement} Calendar page container
 */
export const CalendarContainer = (): ReactElement => {
  const navigate = useNavigate();
  const calendarState = useCalendarQuotations();

  /**
   * Navigate to the order detail page.
   * @param {string} orderId - Order identifier
   * @returns {void} No return value
   */
  const handleNavigateToOrderDetail = (orderId: string): void => {
    navigate(`/order/detail/${orderId}`);
  };

  return <CalendarPageComponent {...calendarState} onNavigateToOrderDetail={handleNavigateToOrderDetail} />;
};

export default CalendarContainer;
