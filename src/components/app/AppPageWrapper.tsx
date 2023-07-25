import ModeSwitch from "../authPortal/ModeSwitch";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import React from "react";
import Searchbar from "./Searchbar";

const AppPageWrapper = ({ children }: { children: React.ReactNode }) => {
    // const storeTheme = useSelector((state: RootState) => state.theme.darkTheme);

    return (
        // root
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-l-workscreen-bg dark:bg-d-100-body-bg font-quicksand">
            {/* header */}
            <div className=" flex flex-row items-center justify-between w-screen h-fit px-8 py-1 bg-primary dark:bg-d-200-cards">
                <Link href="/">
                    <span className="text-4xl font-semibold text-gray-800 dark:text-l-workscreen-bg">
                        KN
                    </span>
                </Link>
                <Searchbar/>
                <ModeSwitch />
            </div>
            <div className="w-screen grow ">{children}</div>
        </div>
    );
};

export default AppPageWrapper;
