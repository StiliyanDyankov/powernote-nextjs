import Image from "next/image";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

export default function Home() {
    return (
        <div>Hello world</div>
    );
}
