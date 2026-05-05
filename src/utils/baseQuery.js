import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../redux/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isAuthRoute = typeof args === "object" && args.url?.startsWith("/auth");

  if (result?.error?.status === 401 && !isAuthRoute) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // ✅ update token in redux
      api.dispatch(
        setCredentials({
          ...api.getState().auth,
          token: refreshResult.data.data.accessToken,
          refreshToken: refreshResult.data.data.refreshToken,
        })
      );

      // retry request
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export default baseQueryWithReauth;
