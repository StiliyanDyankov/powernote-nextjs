"use client"

import { RootState } from "@/utils/store";
import { useDispatch, useSelector } from "react-redux";
import Workscreen from "./Workscreen";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import { Alert, Backdrop, IconButton, Modal, Snackbar } from "@mui/material";
import { closeClosingWorkscreenModal, closeTopicCreationSuccessfulModal, openTopicCreationSuccessfulModal, rearangeWorkscreens } from "@/utils/storeSlices/appSlice";
import CloseIcon from '@mui/icons-material/Close';
import { DndContext, DragEndEvent, PointerSensor, useDndContext, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToParentElement } from "@dnd-kit/modifiers";
import WorkspaceDroppableArea from "./WorkspaceDroppableArea";


export function generateId() {

    return uuidv4();
}

const WorkspaceView = () => {
    const dispatch = useDispatch();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const dndContext = useDndContext();

    useEffect(() => {
        console.log(dndContext.active !== null);
    }, [dndContext.active])

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));

    const stateClosingWorkscreenModal = useSelector((state: RootState) => state.app.closeWorkscreenModal);
    const stateTopicCreationSuccessfulModal = useSelector((state: RootState) => state.app.topicCreationSuccessfulModal);

    const handleDragEnd = (event: DragEndEvent) => {
        dispatch(rearangeWorkscreens({ dragEndEvent: event, inTabId: currentWorkspace!.tabId }));
    }

    return (
        <div className=" overflow-hidden w-full h-full" key={currentWorkspace?.tabId}>

            <div className=" overflow-scroll w-full h-full">

                <div className=" overflow-hidden bg-l-workscreen-bg w-full h-full dark:bg-d-100-body-bg grid grid-cols-2 grid-rows-2 p-1 gap-1 relative">
                    <Snackbar
                        open={stateClosingWorkscreenModal}
                        autoHideDuration={3000}
                        message={"Please close a wokrscreen or open a new tab"}
                        onClose={() => {
                            dispatch(closeClosingWorkscreenModal());
                        }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                sx={{ p: 0.5 }}
                                onClick={() => {
                                    dispatch(closeClosingWorkscreenModal());
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left"
                        }}
                    >
                        <Alert
                            onClose={() => {
                                dispatch(closeClosingWorkscreenModal());
                            }}
                            severity="warning"
                            sx={{ width: '100%' }}
                        >
                            Please close a workscreen or open a new tab
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={stateTopicCreationSuccessfulModal}
                        autoHideDuration={5000}
                        message={"New topic created successfully"}
                        onClose={() => {
                            dispatch(closeTopicCreationSuccessfulModal());
                        }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                sx={{ p: 0.5 }}
                                onClick={() => {
                                    dispatch(closeTopicCreationSuccessfulModal());
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "left"
                        }}
                    >
                        <Alert
                            onClose={() => {
                                dispatch(closeTopicCreationSuccessfulModal());
                            }}
                            severity="success"
                            sx={{ width: '100%' }}
                        >
                            New topic created successfully
                        </Alert>
                    </Snackbar>
                    <DndContext modifiers={[restrictToFirstScrollableAncestor]} sensors={sensors} onDragEnd={handleDragEnd}>
                        <>
                            {
                                currentWorkspace?.workscreens ?
                                    currentWorkspace?.workscreens.map((ws, i) => (
                                        <Workscreen key={i} workscreenContext={ws} tabId={currentWorkspace.tabId} />
                                    )) : null
                            }
                            {
                                currentWorkspace?.workscreens ?
                                    <WorkspaceDroppableArea workscreenAreas={currentWorkspace!.workscreens} firstWs={currentWorkspace.workscreens[0]} /> : null
                            }
                        </>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}

export default WorkspaceView;
