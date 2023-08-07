"use client"
import { RootState } from "@/utils/store";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { createNewTab } from "@/utils/storeSlices/appSlice";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import Tab from "./Tab";
import { restrictToParentElement } from "@dnd-kit/modifiers";


const TabBar = () => {
    const dispatch = useDispatch();
    const tabs = useSelector((state: RootState) => state.app.tabs);

    const handleCreateNewTab = () => {
        const initName = "New Tab";

        dispatch(createNewTab({tabName: initName}))
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return ( 
        <>
            {/* tab bar */}
            <div className="w-full h-9 bg-l-tools-bg border-b border-b-l-divider/50 dark:bg-d-300-chips pl-4 flex flex-row items-end justify-start">
                {/* tab container */}
                <div className=" w-fit h-7 flex flex-row gap-2 items-end justify-start">
                    <DndContext modifiers={[restrictToParentElement]} sensors={sensors}
                        collisionDetection={closestCenter}
                    >
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