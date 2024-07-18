import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '../../config';

export const playlistApi = createApi({
    reducerPath: 'playlistApi',
    tagTypes: ['Playlist'],
    baseQuery: fetchBaseQuery({
        baseUrl: config.api + 'playlist/',
        prepareHeaders: (headers) => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAllPlaylists: builder.query({
            query: () => '',
            providesTags: (result) => (result ? ['Playlist'] : ['Playlist']),
        }),
    }),
});

export const { useGetAllPlaylistsQuery } = playlistApi;
export default playlistApi;
