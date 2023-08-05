"use client"
import { Note } from "@/utils/notesDb";
import { Workscreen } from "@/utils/storeSlices/appSlice";
import { webpage } from "@/utils/webpage";
import { useEffect } from "react";


const EmbedWorkscreen = ({
	workscreenContext,
	currentNote
}: {
	workscreenContext: Workscreen,
	currentNote: Note | null
}) => {


    useEffect(()=> {
        console.log("from within embed ws")
        loadContent()
    }, [currentNote])

    const loadContent = () => {
        console.log(currentNote)
        let doc = new DOMParser().parseFromString(currentNote?.content as string, "text/html")
    }

    return (
        <div className=" w-full h-full p-2">
            <div className=" h-full border border-l-divider/70 px-1 py-2 bg-primary/50 dark:bg-d-400-sibebar rounded-md overflow-hidden">
                <div className=" pb-2 pl-3 font-medium dark:text-l-workscreen-bg/70">Clipped from the web <span className=" italic"> - from <a target="_blank" href={""} className=" hover:underline cursor-pointer"> lkfjdal;kdajsf</a></span></div>
                    <iframe srcDoc={webpage}  className="w-full h-full rounded-md">
                    </iframe>
                <div className="h-2"></div>
            </div>
        </div>
    );
}
 
export default EmbedWorkscreen;