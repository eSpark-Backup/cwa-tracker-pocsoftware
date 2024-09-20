import auth from "./slices/auth";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/auth";
import languageReducer from "./slices/lang";

const store = configureStore({
  reducer: {
    auth,
    [authApi.reducerPath]: authApi.reducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
