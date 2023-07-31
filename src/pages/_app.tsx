"use client"
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { persistor, store } from "../utils/store";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootState } from "../utils/store";
import { ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "@/utils/themeMUI";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
    
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<>HI</>}>
                <App2>
                    <Component {...pageProps} />
                </App2>
            </PersistGate>
        </Provider>
    );
}

export function App2({children}:{children:React.ReactNode}) {
    const mode = useSelector((state: RootState) => state.theme.darkTheme);

    return (
        <ThemeProvider theme={mode ? darkTheme : lightTheme}>
            <div className={`overflow-hidden ${mode ? "dark" : ""}`}>
                {children}
            </div>
        </ThemeProvider>
    );
}