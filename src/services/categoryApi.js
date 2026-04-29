import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/category`,
  }),

  tagTypes: ["Category"],

  endpoints: (builder) => ({

    // CREATE CATEGORY
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Category"],
    }),

    // GET ALL CATEGORIES
    getAllCategories: builder.query({
      query: () => "/",

      providesTags: ["Category"],
    }),

    // GET SINGLE CATEGORY
    getSingleCategory: builder.query({
      query: (id) => `/${id}`,
    }),

  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
} = categoryApi;