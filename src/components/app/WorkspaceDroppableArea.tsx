"use client"
import { RootState } from "@/utils/store";
import { Workscreen } from "@/utils/storeSlices/appSlice";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const WorkspaceDroppableArea = ({ workscreenAreas, firstWs }: { workscreenAreas: Workscreen[], firstWs: Workscreen }) => {
    const dndContext = useDndContext();

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));
    // const firstWs = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]))?.workscreens[0];

    useEffect(()=> {
        console.log("rerenders");
    }, [firstWs])

    return (  
        <>
            {
                dndContext.active !== null ? (
                    <div className="absolute w-full h-full grid grid-cols-2 grid-rows-2 overflow-hidden gap-1 p-1 box-border">
                        {currentWorkspace?.workscreens.map((ws)=> (
                            <DroppableArea workscreenArea={ws} key={ws.id}/>
                        ))}
                    </div>
                ) : null
            }
        </>
    );
}
 
export default WorkspaceDroppableArea;

const DroppableArea = ({ workscreenArea }: { workscreenArea: Workscreen }) => {
    const {setNodeRef, isOver} = useDroppable({
        id: workscreenArea.id,
    });
    return ( 
        <div key={workscreenArea.id + "area"} ref={setNodeRef} className={`z-40 w-full h-full rounded-lg ${workscreenArea.position} ${ isOver? `shadow-[0px_0px_10px_rgba(144,202,249,1)] dark:shadow-[0px_0px_10px_rgba(255,255,255,0.3)]`: null}`}>
            <div   className={`bg-d-100-body-bg/20 dark:bg-l-workscreen-bg/20 w-full h-full rounded-lg ${isOver? "shadow-[inset_0px_0px_10px_rgba(144,202,249,0.3)] dark:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.3)] border-2 border-primary dark:border-d-600-lightest": null} `}>
            </div>
        </div>
    );
}