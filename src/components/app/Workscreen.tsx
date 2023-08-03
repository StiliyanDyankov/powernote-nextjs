"use client"
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { NoteContent, PossiblePositions, Workscreen, WorkscreenTypes, closeWorkscreen } from "@/utils/storeSlices/appSlice";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, ThemeProvider, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import HomeWorkscreen from './HomeWorkscreen';
import NoteWorkscreen from './NoteWorkscreen';
import InteractWorkscreen from './InteractWorkscreen';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import { Note, notesDb } from '@/utils/notesDb';
import { RootState } from '@/utils/store';
import { darkTheme, lightTheme } from '@/utils/themeMUI';
import NoteModal, { ModalStates } from './NoteModal';


const Workscreen = ({ workscreenContext, tabId }: { workscreenContext: Workscreen, tabId: number }) => {

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeWorkscreen({ inTabId: tabId, workscreenId: workscreenContext.id }))
    }

    const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
    const mode = useSelector((state: RootState) => state.theme.darkTheme);

    // for note ws

    const [sync, setSync] = useState<boolean>(true)

    const [currentNote, setCurrentNote] = useState<Note | null>(null)
    
    const syncState = useSelector((state: RootState) => state.app.flexsearchSync)

    useEffect(() => {
        console.log("triggers on change of sync", currentNote)

        if (workscreenContext.type === WorkscreenTypes.NOTE) {
            console.log("runs fjdhsakljadss");
            getNote();
        }
        // works
    }, [sync])
    
    // useEffect(()=> {
    //     if (workscreenContext.type === WorkscreenTypes.NOTE && !syncState) {
    //         console.log("runs fjdhsakljadss");
    //         getNote();
    //     }
    // }, [syncState])

    // useEffect(()=> {

    // }, [])


    const getNote = async () => {
        let note = null;
        try {
            console.log((workscreenContext.content as NoteContent).noteId);
            note = await notesDb.notes.get((workscreenContext.content as NoteContent).noteId);
            if (note) {
                console.log("current note in get", note)
                setCurrentNote(note)
            }
        } catch (e) {
            console.error("error")
        }
    }

    // end of for note ws

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: workscreenContext.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const dndContext = useDndContext();

    useEffect(() => {
        console.log(workscreenContext.position);
    }, [])

    return (
        <div
            key={workscreenContext.id}
            style={style}
            className={`
                ${workscreenContext.position === PossiblePositions.LEFT ? "col-start-1 col-end-2 row-start-1 row-end-3" : ""}
                ${workscreenContext.position === PossiblePositions.RIGHT ? "col-start-2 col-end-3 row-start-1 row-end-3" : ""}
                ${workscreenContext.position === PossiblePositions.FULL ? "col-start-1 col-end-3 row-start-1 row-end-3" : ""}
                 bg-l-tools-bg/30  dark:bg-d-300-chips/50 border border-l-divider/50 rounded-lg w-full h-full flex flex-col  ${dndContext.active?.id === workscreenContext.id ? "z-50" : ""}`}
        >
            {/* header of workscreen */}
            <div className="flex flex-row justify-between items-center rounded-t-lg px-2 h-9 relative">
                <div className="w-fit h-fit flex flex-row justify-center gap-2 items-center text-l-utility-dark dark:text-l-tools-bg z-10">
                    {workscreenContext.type === WorkscreenTypes.NOTE ? (
                        <>
                            <Tooltip title={"Edit Note"}>
                                <IconButton sx={{ width: "1.5rem", height: "1.5rem" }} onClick={() => {
                                    setOpenNoteModal(true);
                                }}>
                                    <MoreVertRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            {/* note name */}

                            <span className=' text-sm'>
                                <Tooltip title={currentNote?.noteName}>
                                    <span className='cursor-default select-none'>
                                        {currentNote ?
                                            currentNote.noteName.length > 30 ?
                                                `${currentNote.noteName.slice(0, 14)}...`
                                                : currentNote.noteName
                                            : ""
                                        }
                                    </span>
                                </Tooltip>
                            </span>

                            <div className=' text-sm flex flex-row justify-center items-center gap-2'>
                                <div className=" border-l border-l-divider pl-2">
                                    {sync ?
                                        <LoopRoundedIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
                                        : <CloudDoneRoundedIcon sx={{ width: "1.2rem", height: "1.2rem" }} />
                                    }
                                </div>
                                <span>
                                    {sync ?
                                        "Synchronising..."
                                        : "Synchronised"
                                    }
                                </span>
                            </div>
                        </>
                    ) : null}
                </div>
                <div className=' absolute flex flex-row items-start justify-center w-full self-start z-0'>
                    <div
                        className=" bg-l-secondary dark:bg-d-500-divider w-20 h-5 self-start rounded-b-md flex items-center justify-center "
                        {...listeners}
                        {...attributes}
                        ref={setNodeRef}
                    >
                        <MoreHorizRoundedIcon sx={{
                            scale: "1.1",
                            fill: "white"
                        }} />
                    </div>
                </div>
                <div className="w-fit h-fit z-10">
                    <IconButton
                        key={workscreenContext.id}
                        sx={{ width: "1.5rem", height: "1.5rem" }}
                        onClick={handleClose}
                    >
                        <CloseRoundedIcon className='' />
                    </IconButton>
                </div>
            </div>

            {/* content of workscreen */}
            <div className=' h-full w-full rounded-b-lg flex flex-col items-center'>
                {workscreenContext.type === WorkscreenTypes.HOME ? (
                    <HomeWorkscreen tabId={tabId} workscreenContext={workscreenContext} />
                ) : null}
                {workscreenContext.type === WorkscreenTypes.INTERACT ? (
                    <InteractWorkscreen />
                ) : null}
                {workscreenContext.type === WorkscreenTypes.NOTE ? (
                    <NoteWorkscreen setSync={setSync} workscreenContext={workscreenContext} currentNote={currentNote} />
                ) : null}
            </div>
            {workscreenContext.type === WorkscreenTypes.NOTE ? (
                <ThemeProvider theme={mode ? darkTheme : lightTheme}>
                    <NoteModal open={openNoteModal} setOpen={setOpenNoteModal} initialState={ModalStates.INFO} editNoteId={currentNote?.id} />
                </ThemeProvider>
            ) : null}
        </div>
    );
}

export default Workscreen;