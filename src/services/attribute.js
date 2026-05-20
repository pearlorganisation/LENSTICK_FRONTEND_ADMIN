import { api } from "./api";

export const colorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE COLOR
    createColor: builder.mutation({
      query: (data) => ({
        url: "/attribute/color/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Color"],
    }),

    // GET ALL COLORS
    getColors: builder.query({
      query: () => ({
        url: "/attribute/color",
        method: "GET",
      }),
      providesTags: ["Color"],
    }),

    // UPDATE COLOR
    updateColor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/attribute/color/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Color"],
    }),

    // DELETE COLOR
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/attribute/color/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Color"],
    }),
  }),
});

export const {
  useCreateColorMutation,
  useGetColorsQuery,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;
