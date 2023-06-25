"use client"

import { createSlice } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface ThemeState {
    darkTheme: boolean;
}

export const persistConfig: PersistConfig<ThemeState> = {
    key: "theme",
    storage,
};

const initialState: ThemeState = {
    darkTheme: false,
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        changeTheme: (state) => {
            state.darkTheme = !state.darkTheme;
        },
    },
});
const persistedReducer = persistReducer(persistConfig, themeSlice.reducer);
export default persistedReducer;

export const { changeTheme } = themeSlice.actions;

// export default themeSlice.reducer;
