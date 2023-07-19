"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface UserState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const persistConfig: PersistConfig<UserState> = {
    key: "user",
    storage,
};


const initialState: UserState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        inputFirstName: (state, action: PayloadAction<string>) => {
            state.firstName = action.payload;
        },
        inputLastName: (state, action: PayloadAction<string>) => {
            state.lastName = action.payload;
        },
        inputEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        clearEmail: (state) => {
            state.email = "";
        },
        inputPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        clearPassword: (state) => {
            state.password = "";
        },
    },
});

export const { inputEmail, inputPassword, clearPassword, clearEmail, inputFirstName, inputLastName } = userSlice.actions;

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);
export default persistedReducer;