import { mediaApi, userApi, playlistApi, canvasApi, constantReducer } from '../services';
import { sidebarReducer } from '../features';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        constant: constantReducer,
        sidebar: sidebarReducer,
        [userApi.reducerPath]: userApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [playlistApi.reducerPath]: playlistApi.reducer,
        [canvasApi.reducerPath]: canvasApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(userApi.middleware, mediaApi.middleware, playlistApi.middleware, canvasApi.middleware),
});

