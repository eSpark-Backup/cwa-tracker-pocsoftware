import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, prepareHeaders } from "./_utils";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  endpoints: (builder) => ({}),
});
