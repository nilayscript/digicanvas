import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isEditingTicker: false,
    isEditingEmbed: false,
    isEditingWeather: false,
    isEditingClock: false,
    isEditingCountdown: false,
    isEditingYoutube: false,
    isEditingWeblink: false,
    isEditingQr: false,
};

const setEditingState = (state, action, key) => {
    Object.keys(state).forEach((k) => {
        state[k] = false;
    });
    state[key] = action.payload;
};

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setEditTicker: (state, action) => {
            setEditingState(state, action, 'isEditingTicker');
        },
        setEditEmbed: (state, action) => {
            setEditingState(state, action, 'isEditingEmbed');
        },
        setEditWeather: (state, action) => {
            setEditingState(state, action, 'isEditingWeather');
        },
        setEditCountdown: (state, action) => {
            setEditingState(state, action, 'isEditingCountdown');
        },
        setEditClock: (state, action) => {
            setEditingState(state, action, 'isEditingClock');
        },
        setEditYoutube: (state, action) => {
            setEditingState(state, action, 'isEditingYoutube');
        },
        setEditWeblink: (state, action) => {
            setEditingState(state, action, 'isEditingWeblink');
        },
        setEditQr: (state, action) => {
            setEditingState(state, action, 'isEditingQr');
        },
    },
});

export const {
    setEditTicker,
    setEditEmbed,
    setEditWeather,
    setEditClock,
    setEditCountdown,
    setEditYoutube,
    setEditWeblink,
    setEditQr,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
