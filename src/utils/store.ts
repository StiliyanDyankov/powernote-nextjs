import { configureStore } from "@reduxjs/toolkit";
import persistedCounterReducer from "./counterSlice";
import { PersistConfig, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage,
};

export const store = configureStore({
    reducer: {
        counter: persistedCounterReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
