import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../redux/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  //  Skip refresh for auth routes
  const isAuthRoute =
    typeof args === "object" && args.url && args.url.startsWith("/auth");

  if (result?.error?.status === 401 && !args._retry && !isAuthRoute) {
    console.log("Token expired, refreshing...");

    const refreshToken = api.getState().auth?.refreshToken;

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(
        setCredentials({
          admin: api.getState().auth.admin,
          token: refreshResult.data.data.accessToken,
          refreshToken: refreshResult.data.data.refreshToken,
        })
      );

      args._retry = true;
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: credentials,
      }),
    }),

    resend: builder.mutation({
      query: (credentials) => ({
        url: "/auth/resend",
        method: "POST",
        body: credentials,
      }),
    }),

    logOut: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(logout()); // clear redux
          dispatch(api.util.resetApiState()); // clear cache
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),

    getUsers: builder.query({
      query: () => "/users",
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendMutation,
  useLogOutMutation,
  useGetUsersQuery,
} = api;
