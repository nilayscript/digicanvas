import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../config';

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: config.api + 'auth/user/',
        prepareHeaders: (headers) => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: () => 'me',
            providesTags: (result) => (result ? ['User'] : ['User']),
        }),
    }),
});

export const { useGetUserQuery } = userApi;
export default userApi;
