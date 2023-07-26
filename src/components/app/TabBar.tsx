"use client"
import { RootState } from "@/utils/store";
import { IconButton, Tabs, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { clearTabs, createNewTab, rearangeTabs, removeTab, setActiveTab } from "@/utils/storeSlices/appSlice";
import { useEffect, useState } from "react";
import { DndContext, PointerSensor, useDndContext, useSensor, useSensors } from "@dnd-kit/core";
import Tab from "./Tab";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";


const TabBar = () => {
    const dispatch = useDispatch();
    const tabs = useSelector((state: RootState) => state.app.tabs);

    const handleCreateNewTab = () => {
        const initName = "some nofnsadfjdaslfkjasldf";

        dispatch(createNewTab(initName))
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(()=> {
        // console.log(tabs);
    }, [tabs])
   
    return ( 
        <>
            {/* tab bar */}
            <div className="w-full h-9 bg-l-tools-bg border-b border-b-l-divider/50 dark:bg-d-300-chips pl-4 flex flex-row items-end justify-start">
                {/* tab container */}
                <div className=" w-fit h-7 flex flex-row gap-2 items-end justify-start">
                    <DndContext modifiers={[restrictToParentElement]} sensors={sensors} onDragEnd={(event)=> {
                        console.log(event);
                        dispatch(rearangeTabs({ delta: event.delta.x, placement: event.over?.id.valueOf() as number, tobeMoved: event.active.id.valueOf() as number}))
                    }}>
                    <div className=" w-fit h-7 flex flex-row gap-2 items-end justify-start">
                        {/* tabs */}
                        {
                            tabs.map((tab, i) => 
                            <Tab tabPayload={tab} id={i} key={i+1}/>
                            )
                        }
                    </div>
                    </DndContext>
                    <IconButton color="secondary" sx={{ width: "1.5rem", height: "1.5rem", p: 0}} className=" self-center" onClick={handleCreateNewTab}>
                        <AddRoundedIcon />
                    </IconButton>
                </div>
            </div>
        </>
    );
}
 
export default TabBar;