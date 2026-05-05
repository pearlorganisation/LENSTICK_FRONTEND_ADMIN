"use client";

import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "./auth/authSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ config
const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// ✅ store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

// ✅ persistor
export const persistor = persistStore(store);
