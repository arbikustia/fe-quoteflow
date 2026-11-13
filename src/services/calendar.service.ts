import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type { CalendarQueryParams, CalendarResponse } from "@/modules/calendar/Calendar.type";

const CALENDAR_TAG = "Calendar";

export const calendarService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarEvents: builder.query<CalendarResponse, CalendarQueryParams>({
      query: (params) => ({
        url: ENDPOINT.DASHBOARD.CALENDAR,
        method: "GET",
        params: {
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
        },
      }),
      providesTags: [CALENDAR_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCalendarEventsQuery } = calendarService;
