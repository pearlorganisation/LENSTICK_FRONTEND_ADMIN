import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import { categoryApi } from "../services/categoryApi";


export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, categoryApi.middleware),
});