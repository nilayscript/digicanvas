import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../config';

export const mediaApi = createApi({
    reducerPath: 'mediaApi',
    tagTypes: ['Media'],
    baseQuery: fetchBaseQuery({
        baseUrl: config.api + 'media/',
        prepareHeaders: (headers) => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllMedia: builder.query({
            query: () => '',
            providesTags: (result) => (result ? ['Media'] : ['Media']),
        }),
        createMedia: builder.mutation({
            query: (body) => ({
                url: 'upload',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Media'],
        }),
        getPresignedUrl: builder.mutation({
            query: (name) => ({
                url: `presigned-url/${name}`,
                method: 'POST',
            }),
        }),
        uploadMediaByLink: builder.mutation({
            query: (body) => ({
                url: 'upload-link',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Media'],
        }),
    }),
});

export const { useGetAllMediaQuery, useCreateMediaMutation, useGetPresignedUrlMutation, useUploadMediaByLinkMutation } =
    mediaApi;
export default mediaApi;
