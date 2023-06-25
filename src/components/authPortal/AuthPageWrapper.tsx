"use client"

import ModeSwitch from "./ModeSwitch";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import React from "react";

const AuthPageWrapper = ({ children }: { children: React.ReactNode }) => {
    const storeTheme = useSelector((state: RootState) => state.theme.darkTheme);

    return (
        // root
        <div className="flex items-center justify-center w-screen h-screen bg-l-workscreen-bg dark:bg-d-100-body-bg font-quicksand">
            {/* header */}
            <div className="absolute top-0 flex flex-row items-center justify-between w-screen px-8 py-2 bg-primary dark:bg-d-200-cards">
                <Link href="/">
                    <span className="text-4xl font-semibold text-gray-800 dark:text-l-workscreen-bg">
                        KN
                    </span>
                </Link>
                <ModeSwitch />
            </div>
            {/* <div
                className="
                w-full h-full
                px-2
                flex flex-col items-center justify-center
            "
            > */}
                <div className="w-96 mx-3">{children}</div>
            </div>
        // </div>
    );
};

export default AuthPageWrapper;
