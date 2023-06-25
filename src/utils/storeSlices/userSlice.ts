"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface UserState {
    email: string;
    password: string;
}

export const persistConfig: PersistConfig<UserState> = {
    key: "user",
    storage,
};


const initialState: UserState = {
    email: "",
    password: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
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

export const { inputEmail, inputPassword, clearPassword, clearEmail } = userSlice.actions;

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);
export default persistedReducer;