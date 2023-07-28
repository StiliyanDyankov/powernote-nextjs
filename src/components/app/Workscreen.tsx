import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { Workscreen, WorkscreenTypes, closeWorkscreen } from "@/utils/storeSlices/appSlice";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { useEffect } from 'react';

const Workscreen = ({workscreenContext, tabId}:{workscreenContext: Workscreen, tabId: number}) => {

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeWorkscreen({inTabId: tabId, workscreenId: workscreenContext.id}))
    }

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: workscreenContext.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;

    const dndContext = useDndContext();

    useEffect(()=> {
        console.log(dndContext.active !== null);
    }, [dndContext.measuringScheduled])

    return ( 
        <div 
            key={workscreenContext.id} 
            style={style} 
            className={` bg-l-tools-bg/30 dark:bg-d-300-chips/50 border border-l-divider/50 rounded-lg w-full h-full flex flex-col ${workscreenContext.position} ${dndContext.active?.id === workscreenContext.id? "z-50": ""}`}
        >
            {/* header of workscreen */}
            <div className="flex flex-row justify-between items-center rounded-t-lg px-2 h-9">
                <div className="w-3 h-3"></div>
                <div 
                    className=" bg-l-secondary dark:bg-d-500-divider w-20 h-5 self-start rounded-b-md flex items-center justify-center"
                    {...listeners}
                    {... attributes}
                    ref={setNodeRef}
                >
                    <MoreHorizRoundedIcon sx={{
                        scale: "1.1",
                        fill: "white"
                    }}/>
                </div>
                <div className="w-fit h-fit">
                    <IconButton key={workscreenContext.id} color="secondary" sx={{ width: "1.5rem", height: "1.5rem"}}
                        onClick={handleClose}
                    >
                        <CloseRoundedIcon className=' dark:fill-l-workscreen-bg/70'/>
                    </IconButton>
                </div>
            </div>
            
            {/* content of workscreen */}
            <div className=' bg-primary h-full w-full rounded-b-lg'>
                {workscreenContext.type === WorkscreenTypes.HOME ? (
                    <div>Home</div>
                ): null}
                {workscreenContext.type === WorkscreenTypes.INTERACT ? (
                    <div>Interact</div>
                ): null}
                {workscreenContext.type === WorkscreenTypes.NOTE ? (
                    <div>Note</div>
                ): null}
            </div>
        </div>
    );
}
 
export default Workscreen;