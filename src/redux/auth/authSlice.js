import { createSlice } from "@reduxjs/toolkit";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    token: token,
    isAuthenticated: !!token,
  },

  reducers: {
    setCredentials: (state, action) => {
      console.log("action payload ", action.payload);
      const { admin, token } = action.payload;
      console.log("admin token in set credentails  ", admin, token);
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
