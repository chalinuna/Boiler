import { createSlice } from '@reduxjs/toolkit';

export const tokenSlice = createSlice({
    name: 'authToken',
    initialState: {
        authenticated: false,
        w_auth: null,
    },
    reducers: {
        GET_TOKEN: (state, action) => {
            state.authenticated = true;
            state.w_auth = action.payload;
        },
        DELETE_TOKEN: (state) => {
            state.authenticated = false;
            state.w_auth = null;
        },
    }
})

export const { GET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;