import { configureStore } from "@reduxjs/toolkit";

import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import themeReducer from "./theme.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    [apiRtkClient.reducerPath]: apiRtkClient.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiRtkClient.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
