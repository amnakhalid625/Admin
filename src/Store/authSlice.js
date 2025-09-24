import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    email: "",
    role: "",
    isAuthenticated: false, // Add this field
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Login success
        login: (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isAuthenticated = true; // Set authenticated to true
        },

        // Logout
        logout: (state) => {
            state.id = "";
            state.name = "";
            state.email = "";
            state.role = "";
            state.isAuthenticated = false; // Set authenticated to false
        },
    },
});

export const { logout, login } = authSlice.actions;

export default authSlice.reducer;