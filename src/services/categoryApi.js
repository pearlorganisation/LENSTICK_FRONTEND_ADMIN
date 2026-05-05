// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const categoryApi = createApi({
//   reducerPath: "categoryApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/category`,
//   }),

//   // 1. Define the Tag
//   tagTypes: ["Category"],

//   endpoints: (builder) => ({
//     // GET ALL CATEGORIES
//     getAllCategories: builder.query({
//       query: () => "/",
//       // 2. Tell this query it provides the "Category" tag
//       providesTags: ["Category"],
//     }),

//     // CREATE CATEGORY
//     createCategory: builder.mutation({
//       query: (data) => ({
//         url: "/create",
//         method: "POST",
//         body: data,
//       }),
//       // 3. Tell this mutation to "break" the Category cache so it refetches
//       invalidatesTags: ["Category"],
//     }),

//     // UPDATE CATEGORY
//     getUpdateCategory: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       // 3. Invalidate on Update
//       invalidatesTags: ["Category"],
//     }),

//     // DELETE CATEGORY
//     deleteCategory: builder.mutation({
//       query: (id) => ({
//         url: `/${id}`,
//         method: "DELETE",
//       }),
//       // 3. Invalidate on Delete
//       invalidatesTags: ["Category"],
//     }),

//     getSingleCategory: builder.query({
//       query: (id) => `/${id}`,
//       providesTags: (result, error, id) => [{ type: "Category", id }],
//     }),
//   }),
// });

// export const {
//   useCreateCategoryMutation,
//   useGetAllCategoriesQuery,
//   useGetSingleCategoryQuery,
//   useGetUpdateCategoryMutation,
//   useDeleteCategoryMutation,
// } = categoryApi;

import { api } from "./api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getAllCategories: builder.query({
      query: () => "/category",
      providesTags: ["Category"],
    }),

    // CREATE CATEGORY
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // UPDATE CATEGORY
    getUpdateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // GET SINGLE
    getSingleCategory: builder.query({
      query: (id) => `/category/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useGetUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
