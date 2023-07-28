import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Workscreen, WorkscreenTypes, closeWorkscreen } from "@/utils/storeSlices/appSlice";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { useEffect } from 'react';
import HomeWorkscreen from './HomeWorkscreen';
import NoteWorkscreen from './NoteWorkscreen';
import InteractWorkscreen from './InteractWorkscreen';

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
                <div className="w-fit h-fit">
                    {workscreenContext.type === WorkscreenTypes.NOTE ? (
                        <IconButton sx={{ width: "1.5rem", height: "1.5rem"}}>
                            <MoreVertRoundedIcon/>
                        </IconButton>
                    ): null}
                </div>
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
                    <IconButton 
                        key={workscreenContext.id} 
                        sx={{ width: "1.5rem", height: "1.5rem"}}
                        onClick={handleClose}
                    >
                        <CloseRoundedIcon className=''/>
                    </IconButton>
                </div>
            </div>
            
            {/* content of workscreen */}
            <div className=' h-full w-full rounded-b-lg flex flex-col items-center'>
                {workscreenContext.type === WorkscreenTypes.HOME ? (
                    <HomeWorkscreen/>
                ): null}
                {workscreenContext.type === WorkscreenTypes.INTERACT ? (
                    <InteractWorkscreen/>
                ): null}
                {workscreenContext.type === WorkscreenTypes.NOTE ? (
                    <NoteWorkscreen/>
                ): null}
            </div>
        </div>
    );
}
 
export default Workscreen;