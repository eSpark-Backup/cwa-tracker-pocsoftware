import { api } from "./rtk";

export const devicesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDevices: builder.mutation({
            query: () => "/devices",
            invalidatesTags: ["devices"],
        }),
    }),
});

export const {
    useGetDevicesMutation
} = devicesApi;
