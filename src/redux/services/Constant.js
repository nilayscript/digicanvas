import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    uploadMediaList: [],
    showMediaUpload: false,
};

const constantSlice = createSlice({
    name: 'constant',
    initialState,
    reducers: {
        updateUploadMediaList: (state, action) => {
            state.uploadMediaList = action.payload;
        },
        switchMediaUpload: (state, action) => {
            state.showMediaUpload = action.payload;
            if (!action.payload) {
                state.uploadMediaList = [];
            }
        },
    },
});

export const { updateUploadMediaList, switchMediaUpload } = constantSlice.actions;
export default constantSlice.reducer;
