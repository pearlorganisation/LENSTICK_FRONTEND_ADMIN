import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { authApi } from "./services/";
// import authReducer from "./features/authSlice";
import authReducer from "./auth/authSlice.js"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
