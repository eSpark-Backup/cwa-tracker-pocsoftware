import { api } from "./rtk";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['auth'],
    }),
  }),
});

export const { useLoginMutation } = authApi;
