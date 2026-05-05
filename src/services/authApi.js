import { api } from "./api";
import { logout } from "../redux/auth/authSlice"; // 👈 FIX

export const authApi = api.injectEndpoints({
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

          dispatch(logout());
          dispatch(api.util.resetApiState());
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
} = authApi;
