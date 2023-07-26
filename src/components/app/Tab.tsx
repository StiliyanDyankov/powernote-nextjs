import { IconButton, Tooltip } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Tab, removeTab, setActiveTab } from "@/utils/storeSlices/appSlice";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


const Tab = ({tabPayload, id}: {tabPayload: Tab, id: number}) => {
    const dispatch = useDispatch();
    const tabActivityChain = useSelector((state: RootState) => state.app.tabActivityChain);
    const numOfTabs = useSelector((state: RootState) => state.app.tabs.length);

    const [open, setOpen] = useState(false);

    const dndContext = useDndContext();
      
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: tabPayload.tabId,
    });
    
    const style = transform ? {
        transform: `translateX(${transform.x}px)`,
    } : undefined;

    const handleRemoveTab = (id: number) => {
        dispatch(removeTab(id))
    }

    const handleSetActiveTab = (id: number) => {
        if(tabActivityChain[tabActivityChain.length-1] !== id) {
            dispatch(setActiveTab(id))
        }
    }

    useEffect(()=> {
        setOpen(false)
    }, [dndContext])
    return (
        <>

        {/* wrapper for the solid bg and shadow */}
            <div
                className={` bg-l-tools-bg rounded-t-md ${ tabPayload.tabId === dndContext.active?.id ? "z-20" : ""}`}
                style={style}
                {...listeners}
                {... attributes}
                ref={setNodeRef}
                onClick={(event: React.MouseEvent<HTMLDivElement>)=> {
                    handleSetActiveTab(tabPayload.tabId);
                }}
            >
                <Tooltip onOpen={()=> {
                    if(dndContext.active === null) setOpen(true);
                    else setOpen(false);
                }} onClose={()=> {setOpen(false)}} open={open} title={tabPayload.tabName} key={id} disableHoverListener={dndContext.active !== null} enterDelay={1000} sx={{
                    [`& .${tooltipClasses.tooltip}`]: {
                        backgroundColor: '#f5f5f9',
                        color: 'rgba(0, 0, 0, 0.87)',
                        maxWidth: 220,
                        border: '1px solid #dadde9',
                      },
                }}>
                    <div 
                        className={`w-48 h-7 ${ tabPayload.tabId === tabActivityChain[tabActivityChain.length-1] ? "bg-primary" : "bg-primary/50"} relative rounded-t-md flex flex-row items-center justify-between pl-2 font-thin text-sm hover:bg-primary/80 hover:dark:bg-primary/70`} 
                    >
                        {dndContext.active? (<DroppableArea id={tabPayload.tabId}/>):(null)}
                        <p className=" cursor-default select-none">{tabPayload.tabName.length > 14 ? `${tabPayload.tabName.slice(0,14)}...${tabPayload.tabId}` : tabPayload.tabName}</p>
                        <IconButton color="secondary" className={` `} sx={{ width: "1.5rem", height: "1.5rem", mr: "2px"}} onClick={(event: React.MouseEvent<HTMLButtonElement>)=> {
                            event.stopPropagation();
                            handleRemoveTab(tabPayload.tabId);
                        }}>
                            <CloseRoundedIcon style={{scale: "0.8"}} className="dark:fill-l-secondary"/>
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
        </>
    );
}
 
export default Tab;

const DroppableArea = ({id}: {id:number}) => {
    const {setNodeRef, isOver} = useDroppable({
        id: id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
      };
      
    return ( 
        <div
            key={id}
            style={style}
            className="absolute h-full w-full"
            ref={setNodeRef}
        ></div> 
    );
}
 