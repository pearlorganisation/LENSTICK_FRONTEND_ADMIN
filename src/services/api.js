import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "../utils/baseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Product", "Category"],
  endpoints: () => ({}),
});
