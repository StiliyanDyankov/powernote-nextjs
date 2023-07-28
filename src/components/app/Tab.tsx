import { IconButton, Tooltip } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Tab, rearangeTabs, removeTab, setActiveTab } from "@/utils/storeSlices/appSlice";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";


const Tab = ({tabPayload, id}: {tabPayload: Tab, id: number}) => {
    const dispatch = useDispatch();
    const tabActivityChain = useSelector((state: RootState) => state.app.tabActivityChain);
    const tabs = useSelector((state: RootState) => state.app.tabs);

    const dndContext = useDndContext();
      
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: tabPayload.tabId,
        data: {id}
    });

    const [open, setOpen] = useState<boolean>(false);

    const prevOver = useRef(null)

    const dragging = useRef<boolean>(false);
    
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
        if(dndContext.active && !dragging.current) {
            dragging.current = true;
        }
        if(!dndContext.active && dragging.current) {
            setTimeout(() => {
                dragging.current = false;
            }, 1000);
        }
    },[dndContext.active])
    
    useEffect(()=> {
        if(dndContext.active?.id === tabPayload.tabId) {
            if(dndContext.active !== null && dndContext.over !== null) {
                if(tabs.indexOf(tabPayload) > (dndContext.active.data.current as any).id) {
                    // if item is on the left
                    if(!prevOver.current || (prevOver.current as any).id !== dndContext.over.id ) {
                        prevOver.current = dndContext.over as any;
                        dispatch(rearangeTabs({ delta: 1, placement: dndContext.over?.id.valueOf() as number, tobeMoved: dndContext.active.id.valueOf() as number}))
                    }
                } else {
                    if(!prevOver.current || (prevOver.current as any).id !== dndContext.over.id ) {
                        prevOver.current = dndContext.over as any;
                        dispatch(rearangeTabs({ delta: -1, placement: dndContext.over?.id.valueOf() as number, tobeMoved: dndContext.active.id.valueOf() as number}))
                    }
                }
            }
        }

    }, [dndContext])
    
    return (
        <>

        {/* wrapper for the solid bg and shadow */}
            <div
                className={` bg-l-tools-bg dark:bg-d-300-chips rounded-t-lg ${ tabPayload.tabId === dndContext.active?.id ? "z-20" : ""}`}
                style={style}
                {...listeners}
                {... attributes}
                ref={setNodeRef}
                onClick={(event: React.MouseEvent<HTMLDivElement>)=> {
                    handleSetActiveTab(tabPayload.tabId);
                }}
            >
                <Tooltip onOpen={()=> {
                    if(dragging.current) setOpen(false);
                    else setOpen(true);
                }} onClose={()=> { setOpen(false)}} open={open && !dragging.current} title={tabPayload.tabName} key={id} enterDelay={1000} >
                    <div 
                        className={`w-48 h-7 ${ tabPayload.tabId === tabActivityChain[tabActivityChain.length-1] ? "bg-primary dark:bg-d-600-lightest" : "bg-primary/50 dark:bg-d-600-lightest/50"} relative rounded-t-md flex flex-row items-center justify-between pl-2 font-thin text-sm hover:bg-primary/80 hover:dark:bg-d-600-lightest/80`} 
                    >
                        {dndContext.active? (<DroppableArea id={tabPayload.tabId}/>):(null)}
                        <p className={` cursor-default select-none ${ tabPayload.tabId !== tabActivityChain[tabActivityChain.length-1] ? "dark:text-l-workspace-bg/70": ""}`}>{tabPayload.tabName.length > 14 ? `${tabPayload.tabName.slice(0,14)}...${tabPayload.tabId}` : tabPayload.tabName}</p>
                        <IconButton color="secondary" sx={{ width: "1.5rem", height: "1.5rem", mr: "2px"}} onClick={(event: React.MouseEvent<HTMLButtonElement>)=> {
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
 