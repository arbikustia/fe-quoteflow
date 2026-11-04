import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { CalendarPageComponent } from "./Calendar.component";
import { useCalendarQuotations } from "./Calendar.hook";

/** Container managing quotation calendar page. */
export const CalendarContainer = (): ReactElement => {
  const navigate = useNavigate();
  const calendarState = useCalendarQuotations();

  const handleNavigateToOrderDetail = (orderId: string): void => {
    navigate(`/order/detail/${orderId}`);
  };

  return <CalendarPageComponent {...calendarState} onNavigateToOrderDetail={handleNavigateToOrderDetail} />;
};

export default CalendarContainer;
