import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../config';

export const canvasApi = createApi({
    reducerPath: 'canvasApi',
    tagTypes: ['Canvas'],
    baseQuery: fetchBaseQuery({
        baseUrl: config.api + 'canvas/',
        prepareHeaders: (headers) => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllCanvas: builder.query({
            query: () => '',
            providesTags: (result) => (result ? ['Canvas'] : ['Canvas']),
        }),
        createCanvas: builder.mutation({
            query: (body) => ({
                url: '',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Canvas'],
        }),
        updateCanvas: builder.mutation({
            query: (body) => ({
                url: `${body._id.$oid}`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Canvas'],
        }),
    }),
});

export const { useCreateCanvasMutation, useUpdateCanvasMutation, useGetAllCanvasQuery } = canvasApi;
export default canvasApi;
