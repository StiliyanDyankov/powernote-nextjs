"use client"

import { createSlice } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const initialState = {
    value: 0,
};

export const persistConfig: PersistConfig<ICounterState> = {
    key: 'counter',
    storage,
}

export interface ICounterState {
    value: number,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});

const persistedReducer = persistReducer(persistConfig, counterSlice.reducer);

export default persistedReducer;

export const { increment, decrement } = counterSlice.actions;