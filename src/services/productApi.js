import { api } from "./api";

export const productApi = api.injectEndpoints({
  overrideExisting: false,

  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/product/all",

      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map((product) => ({
                type: "Product",
                id: product._id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/product/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    updateVariantStock: builder.mutation({
      query: ({ productId, variantId, stock }) => ({
        url: `/product/update-stock/${productId}/${variantId}`,
        method: "PUT",
        body: { stock },
      }),

      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateVariantStockMutation,
} = productApi;
