"use client"

import persistedCounterReducer from "./counterSlice";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import persistedThemeReducer from "./storeSlices/themeSlice";
import persistedUserReducer from "./storeSlices/userSlice";
import persistedRegisterReducer from "./storeSlices/registerSlice";
import persistedForgotReducer from "./storeSlices/forgotSlice";
import persistedTokenReducer from "./storeSlices/tokenSlice";
import persistedAppReducer from "./storeSlices/appSlice";
import thunk from "redux-thunk";
import { PersistConfig, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Api } from "./apiService";


export const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
};

export const store = configureStore({
    reducer: {
        theme: persistedThemeReducer,
        user: persistedUserReducer,
        register: persistedRegisterReducer,
        forgot: persistedForgotReducer,
        token: persistedTokenReducer,
        app: persistedAppReducer,
        [Api.reducerPath]: Api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk)
        .concat(Api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
