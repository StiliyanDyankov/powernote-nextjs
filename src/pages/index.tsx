import { Quicksand } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "@/utils/counterSlice";
import { RootState } from "@/utils/store";
import { Button } from "@mui/material";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function Home() {
    const dispatch = useDispatch();
    const counter = useSelector((state:RootState) => state.counter.value);

    return (
        <>
            <h1>Home Page</h1>
            <h2>Counter: {counter}</h2>
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
        </>
    );
}
