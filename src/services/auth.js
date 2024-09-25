import { api } from "./rtk";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"],
    }),
    generateQR: builder.mutation({
      query: (credentials) => ({
        url: "/generate-qr",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"],
    }),
    verifyToken: builder.mutation({
      query: (credentials) => ({
        url: "/verify-token",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGenerateQRMutation,
  useVerifyTokenMutation,
} = authApi;
