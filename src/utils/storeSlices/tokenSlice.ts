"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface TokenState {
    token: string;
}

export const persistConfig: PersistConfig<TokenState> = {
    key: "token",
    storage,
};

const initialState: TokenState = {
    token: "",
};

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = "";
        },
    },
});

export const { setToken, clearToken } = tokenSlice.actions;

const persistedReducer = persistReducer(persistConfig, tokenSlice.reducer);
export default persistedReducer;