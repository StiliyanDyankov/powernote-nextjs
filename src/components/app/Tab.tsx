"use client"
import { IconButton, OutlinedInput, Popover, TextField, Tooltip, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { Tab, rearangeTabs, removeTab, renameTab, setActiveTab } from "@/utils/storeSlices/appSlice";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";


const Tab = ({ tabPayload, id }: { tabPayload: Tab, id: number }) => {
    const dispatch = useDispatch();
    const tabActivityChain = useSelector((state: RootState) => state.app.tabActivityChain);
    const tabs = useSelector((state: RootState) => state.app.tabs);

    const dndContext = useDndContext();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: tabPayload.tabId,
        data: { id }
    });

    const [open, setOpen] = useState<boolean>(false);

    const prevOver = useRef(null)

    const dragging = useRef<boolean>(false);

    const [popRename, setPopRename] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<HTMLParagraphElement | null>(null);

    const inputRef = useRef<HTMLInputElement>(null)

    const style = transform ? {
        transform: `translateX(${transform.x}px)`,
    } : undefined;

    const handleRemoveTab = (id: number) => {
        dispatch(removeTab(id))
    }

    const handleSetActiveTab = (id: number) => {
        if (tabActivityChain[tabActivityChain.length - 1] !== id) {
            dispatch(setActiveTab(id))
        }
    }

    useEffect(() => {
        if (dndContext.active && !dragging.current) {
            dragging.current = true;
        }
        if (!dndContext.active && dragging.current) {
            setTimeout(() => {
                dragging.current = false;
            }, 1000);
        }
    }, [dndContext.active])

    useEffect(() => {
        if (dndContext.active?.id === tabPayload.tabId && !popRename) {
            if (dndContext.active !== null && dndContext.over !== null) {
                if (tabs.indexOf(tabPayload) > (dndContext.active.data.current as any).id) {
                    // if item is on the left
                    if (!prevOver.current || (prevOver.current as any).id !== dndContext.over.id) {
                        prevOver.current = dndContext.over as any;
                        dispatch(rearangeTabs({ delta: 1, placement: dndContext.over?.id.valueOf() as number, tobeMoved: dndContext.active.id.valueOf() as number }))
                    }
                } else {
                    if (!prevOver.current || (prevOver.current as any).id !== dndContext.over.id) {
                        prevOver.current = dndContext.over as any;
                        dispatch(rearangeTabs({ delta: -1, placement: dndContext.over?.id.valueOf() as number, tobeMoved: dndContext.active.id.valueOf() as number }))
                    }
                }
            }
        }

    }, [dndContext, popRename])

    const handleTabNameClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
        setPopRename(true)
        setAnchorEl(event.currentTarget);
        inputRef.current?.select();
    }

    const handleClose = () => {
        setAnchorEl(null);
        setPopRename(false)
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select()
    }

    const handleTabNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(renameTab({ inTabId: tabPayload.tabId, newName: event.target.value}))
    }

    return (
        <>

            {/* wrapper for the solid bg and shadow */}
            <div
                className={` bg-l-tools-bg dark:bg-d-300-chips rounded-t-lg ${tabPayload.tabId === dndContext.active?.id ? "z-20" : ""}`}
                style={style}
                {...listeners}
                {...attributes}
                ref={setNodeRef}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                    handleSetActiveTab(tabPayload.tabId);
                }}
            >
                <Tooltip onOpen={() => {
                    if (dragging.current) setOpen(false);
                    else setOpen(true);
                }} onClose={() => { setOpen(false) }} open={open && !dragging.current && !popRename} title={tabPayload.tabName} key={id} enterDelay={1000} >
                    <div
                        className={`w-48 h-7 ${tabPayload.tabId === tabActivityChain[tabActivityChain.length - 1] ? "bg-primary dark:bg-d-600-lightest" : "bg-primary/50 dark:bg-d-600-lightest/50"} relative rounded-t-md flex flex-row items-center justify-between pl-2 font-thin text-sm hover:bg-primary/80 hover:dark:bg-d-600-lightest/80`}
                    >
                        {dndContext.active ? (<DroppableArea id={tabPayload.tabId} />) : (null)}
                        <p className={` cursor-default select-none dark:text-l-workspace-bg/70`} onClick={handleTabNameClick}>
                            {tabPayload && tabPayload.tabName.length > 14 ? `${tabPayload.tabName.slice(0, 20)}` : tabPayload.tabName}
                        </p>
                        <Popover
                            id={tabPayload.tabId.toString()}
                            open={popRename}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <div className=" p-1">
                                <OutlinedInput
                                    onFocus={handleFocus}
                                    inputRef={inputRef}
                                    defaultValue={tabPayload.tabName}
                                    autoFocus
                                    onChange={handleTabNameChange}
                                    sx={{
                                        '.MuiInputBase-input': {
                                            p: "4px"
                                        }
                                    }}
                                />
                            </div>
                        </Popover>
                        <IconButton
                            // color="secondary" 
                            sx={{ width: "1.5rem", height: "1.5rem", mr: "2px" }}
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                handleRemoveTab(tabPayload.tabId);
                            }}
                        >
                            <CloseRoundedIcon style={{ scale: "0.8" }} className="dark:fill-l-tools-bg/70" />
                        </IconButton>
                    </div>
                </Tooltip>
            </div>
        </>
    );
}

export default Tab;

const DroppableArea = ({ id }: { id: number }) => {
    const { setNodeRef, isOver } = useDroppable({
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
