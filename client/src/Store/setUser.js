import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'authUser',
    initialState: {
        u_id: null,
        u_email: null,
        u_name: null,
        u_nik: null,
        u_role: null,
        u_image: null
    },
    reducers: {
        GET_USER: (state, action) => {
            state.u_id = action.payload._id
            state.u_email = action.payload.email
            state.u_name = action.payload.name
            state.u_nik = action.payload.nikname
            state.u_role= action.payload.role
            state.u_image= action.payload.image
        },
        DELETE_USER: (state) => {
            state.u_id = null
            state.u_email = null
            state.u_name = null            
            state.u_nik = null
            state.u_role = null
            state.u_image = null
        },
    }
})

export const { GET_USER, DELETE_USER } = userSlice.actions;

export default userSlice.reducer;