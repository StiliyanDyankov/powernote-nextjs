"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface ForgotSlice {
    currentStep: number;
    pin: string;
}

export const persistConfig: PersistConfig<ForgotSlice> = {
    key: "register",
    storage,
};

const initialState: ForgotSlice = {
    currentStep: 0,
    pin: "",
};

const forgotSlice = createSlice({
    initialState,
    name: "forgot",
    reducers: {
        goNextStep: (state) => {
            state.currentStep = state.currentStep + 1;
        },
        goPrevStep: (state) => {
            state.currentStep = state.currentStep - 1;
        },
        resetSteps: (state) => {
            state.currentStep = 0;
        },
        setPin: (state, action: PayloadAction<string>) => {
            state.pin = action.payload;
        },
    },
});

const persistedReducer = persistReducer(persistConfig, forgotSlice.reducer);
export default persistedReducer;

export const { goNextStep, goPrevStep, resetSteps, setPin } =
    forgotSlice.actions;
