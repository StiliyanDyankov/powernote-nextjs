"use client"

import { Quicksand } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "@/utils/counterSlice";
import { RootState } from "@/utils/store";
import { Button } from "@mui/material";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function Home() {
    const dispatch = useDispatch();

    return (
        <>
            <h1>Home Page</h1>
            <Button
                variant="outlined"
                onClick={() => dispatch(increment())}
            >
                Increment
            </Button>
            <Button
                variant="outlined"
                onClick={() => dispatch(decrement())}
            >
                Decrement
            </Button>
            {/* <img src="images/Screenshot_2023-06-26-12-27-39-948_com.miui.gallery-edit.jpg" alt="" /> */}
        </>
    );
}
