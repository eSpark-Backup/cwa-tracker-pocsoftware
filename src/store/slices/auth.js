import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/auth";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      console.log("logout")
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { token, name, email } = payload?.data;
        const user = { name, email };
        state.token = token;
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      }
    );
  },
});

export const { logout } = slice.actions;

export default slice.reducer;
