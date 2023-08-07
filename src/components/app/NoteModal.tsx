"use client"

import { RootState } from "@/utils/store";
import { colorsTailwind } from "@/utils/themeMUI";
import { Box, Button, Chip, CircularProgress, Divider, FormControl, IconButton, InputLabel, MenuItem, Modal, OutlinedInput, Select, SelectChangeEvent, TextField, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useRef, useState } from "react";
import { Topic, notesDb } from "@/utils/notesDb";
import { NoteUnsyncOperations, Tab, WorkscreenTypes, createNewTab, createWorkscreen, openNoteDeleteSuccessfulModal, openNoteEditSuccessfulModal, setFlexsearchSyncState } from "@/utils/storeSlices/appSlice";
import { generateId } from "./WorkspaceView";
import Delta from "quill-delta";
import TopicSelector from "./TopicSelector";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { index } from "@/pages/app";
import { useCreateNewNoteMutation, useDeleteNoteMutation, useUpdateNoteMetadataMutation } from "@/utils/apiService";


export enum ModalStates {
    CREATE = "CREATE",
    INFO = "INFO",
    EDIT = "EDIT"
}


const NoteModal = (
    {
        initialState,
        open,
        setOpen,
        currentWorkspace,
        createInNewTab,
        editNoteId,
    }: {
        initialState: ModalStates;
        open: boolean;
        setOpen: (state: boolean) => void;
        currentWorkspace?: Tab | undefined;
        createInNewTab?: boolean;
        editNoteId?: string;
    }) => {

    const dispatch = useDispatch();

    const mode = useSelector((state: RootState) => state.theme.darkTheme);

    const [modalState, setModalState] = useState<ModalStates>(initialState)

    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])

    const [noteId, setNoteId] = useState<string | null>(null)

    const [noteName, setNoteName] = useState<string>("New Note")

    const [noteDescription, setNoteDescription] = useState<string>("")

    const [noteTopics, setNoteTopics] = useState<string[]>([])

    const [operationState, setOperationState] = useState<boolean>(false);



    const token = useSelector((state: RootState) => state.token);

    const [createNewNoteMutation, { isLoading: isCreateLoading }] = useCreateNewNoteMutation();
    const [updateNoteMutation, { isLoading: isUpdateLoading }] = useUpdateNoteMetadataMutation();
    const [deleteNoteMutation, { isLoading: isDeleteLoading }] = useDeleteNoteMutation();


    const getCurrentNumOfDocs = async () => {
        const numOfDocs = await notesDb.notes.count();
        setNoteName(`New Note ${numOfDocs + 1}`)
    }

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        setAvailableTopics(availableTopics);
    }

    useEffect(() => {
        getCurrentNumOfDocs();
        getAvailableTopics();

        if(modalState === ModalStates.EDIT) {
            setModalState(ModalStates.INFO)
        }

        // not needed because of unique key

        // setNoteName("New Note");
        // setNoteDescription("");
        // setNoteTopics([]);
        if (modalState !== ModalStates.CREATE) {
            loadNoteData();
        }
    }, [open])


    useEffect(() => {
        if (operationState && noteId && modalState === ModalStates.CREATE) {
            setOpen(false);
            if (currentWorkspace) {
                // create new note

                dispatch(createWorkscreen({ inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.NOTE, options: { noteId: noteId } }))
            } else {
                // create new note

                dispatch(createNewTab({ tabName: noteName, workscreen: { type: WorkscreenTypes.NOTE, content: { noteId: noteId } } }))
            }
            setOperationState(false);
        } else if (operationState && modalState === ModalStates.EDIT) {
            // handle successfull edit case
            dispatch(openNoteEditSuccessfulModal());
            setOpen(false);
            setOperationState(false);
        }

    }, [operationState]);

    useEffect(()=> {
    },[modalState])

    const handleMainActionClick = () => {
        if (modalState === ModalStates.CREATE) {
            createNewNote();
        } else if (modalState === ModalStates.EDIT) {
            editNote();
        }
    }

    const loadNoteData = async () => {
        if (!editNoteId) {
            return;
        }

        try {
            const noteData = await notesDb.notes.get(editNoteId);
            if (noteData) {
                setNoteName(noteData.noteName as string);
                setNoteDescription(noteData.description as string);
                setNoteTopics(noteData.topics as string[]);
            }
        } catch (error) {
            console.log("error with edit note", error)
        }
    }

    const editNote = async () => {
        if (!editNoteId) {
            return;
        }

        try {
            const id = await notesDb.notes.update(editNoteId, {
                noteName: noteName,
                topics: noteTopics,
                description: noteDescription,
                lastModified: Date.now(),
            })
            if (id) {
                await updateNoteMutation({
                    token: token,
                    note: {
                        id: editNoteId,
                        noteName: noteName,
                        topics: noteTopics,
                        description: noteDescription,
                        lastModified: Date.now(),
                    }
                }).unwrap().then(async (res) => {
                    dispatch(setFlexsearchSyncState({
                        syncState: false,
                        details: {
                            operation: NoteUnsyncOperations.UPDATE,
                            inNoteId: editNoteId
                        }
                    }));
                    setOperationState(true);
                    const note = await notesDb.notes.get(editNoteId);
                    if(note) {
                        index.update({
                            id: note.id,
                            noteName: note.noteName, 
                        })
                    }
                }).catch((err)=> {
                    // ?
                })

            }
        } catch (error) {
            console.log("error with edit note", error)
        }
    }

    const createNewNote = async () => {
        try {
            const generatedId = generateId()
            const id = await notesDb.notes.add({
                id: generatedId,
                noteName: noteName,
                topics: noteTopics,
                description: noteDescription,
                createdAt: Date.now(),
                lastModified: Date.now(),
                content: new Delta().insert(""),
            })
            if (id) {
                // here
                await createNewNoteMutation({
                    token: token,
                    note: {
                        id: generatedId,
                        noteName: noteName,
                        topics: noteTopics,
                        description: noteDescription,
                        createdAt: Date.now(),
                        lastModified: Date.now(),
                        content: ""
                    }
                }).unwrap().then((res) => {
                    setOperationState(true);
                    setNoteId(id.toString());
                    dispatch(setFlexsearchSyncState({
                        syncState: false,
                        details: {
                            operation: NoteUnsyncOperations.CREATE,
                            inNoteId: id as string
                        }
                    }));
                }).catch((err)=> {
                    // ?
                })
            }
        } catch (error) {
            console.log("error with creating note", error)
        }
    }

    const handleDeleteIconClick = async () => {
        if (!editNoteId) {
            return;
        }

        try {
            const id = await notesDb.notes.delete(editNoteId);

            await deleteNoteMutation({
                noteId: editNoteId,
                token: token,
            }).unwrap().then((res) => {
                dispatch(setFlexsearchSyncState({
                    syncState: false,
                    details: {
                        operation: NoteUnsyncOperations.CREATE,
                        inNoteId: editNoteId
                    }
                }));
                dispatch(openNoteDeleteSuccessfulModal());
                setOpen(false);
            }).catch((err)=> {
                // ?
            })


        } catch (error) {
            console.log("error with delete note", error)
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => {
                setOpen(false)
            }}
            sx={{
                fontFamily: "Quicksand, sans-serif"
            }}
            key={editNoteId || noteId}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "fit",
                    height: "fit",
                }}
            >

                <div
                    className=" rounded-lg flex flex-col gap-2 p-2 w-96 h-fit border border-l-divider"
                    style={{
                        // padding: "4rem",
                        backgroundColor: mode ? colorsTailwind["d-300-chips"] : colorsTailwind["l-workscreen-bg"],
                        color: mode ? colorsTailwind["l-workscreen-bg"] : colorsTailwind["l-secondary"],
                    }}
                >
                    <div className="flex flex-row justify-between items-center rounded-t-lg  h-10 relative">
                        <div className="w-fit h-fit flex flex-row justify-center gap-2 items-center text-l-utility-dark dark:text-l-tools-bg z-10">
                            {
                                modalState === ModalStates.INFO ?
                                    // delete icon
                                    (
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <Tooltip title={"Delete Note"}>
                                                <IconButton
                                                    sx={{ width: "1.7rem", height: "1.7rem" }}
                                                    onClick={handleDeleteIconClick}
                                                >
                                                    <DeleteRoundedIcon sx={{
                                                        '&:hover': {
                                                            fill: "red"
                                                        }
                                                    }} />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title={"Edit Note"}>
                                                <IconButton
                                                    sx={{ width: "1.5rem", height: "1.5rem" }}
                                                    onClick={() => {
                                                        setModalState(ModalStates.EDIT)
                                                    }}
                                                >
                                                    <EditNoteRoundedIcon className='' />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    )
                                    : null
                            }
                            {
                                modalState === ModalStates.EDIT ?
                                    <Tooltip title={"Delete Note"}>
                                        <IconButton
                                            sx={{ width: "1.7rem", height: "1.7rem" }}
                                            onClick={handleDeleteIconClick}
                                        >
                                            <DeleteRoundedIcon sx={{
                                                '&:hover': {
                                                    fill: "red"
                                                }
                                            }} />
                                        </IconButton>
                                    </Tooltip>
                                    : null
                            }
                        </div>
                        <div className=" font-medium text-lg">
                            {
                                modalState === ModalStates.CREATE ? "Create New Note" : noteName
                            }
                        </div>
                        <div className="w-fit h-fit z-10">
                            <IconButton
                                sx={{ width: "1.5rem", height: "1.5rem" }}
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseRoundedIcon className='' />
                            </IconButton>
                        </div>
                    </div>
                    <div className="px-2 flex flex-col gap-4 ">

                        <TextField
                            variant="outlined"
                            color="secondary"
                            label={true ? "Name" : ""}
                            // disabled
                            value={noteName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNoteName(e.target.value);
                            }}
                            disabled={modalState === ModalStates.INFO}
                        />

                        <Divider />

                        <TextField
                            variant="outlined"
                            color="secondary"
                            label={"Description"}
                            // disabled
                            value={noteDescription}
                            multiline
                            rows={4}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNoteDescription(e.target.value);
                            }}
                            disabled={modalState === ModalStates.INFO}
                        />

                        <Divider />

                        <TopicSelector selectedTopics={noteTopics} setSelectedTopics={setNoteTopics} disabled={modalState === ModalStates.INFO} />


                        {
                            modalState !== ModalStates.INFO ?
                                <div className="flex flex-row gap-2 pb-2">
                                    <Button
                                        className="grow"
                                        variant="outlined"
                                        color="secondary"
                                        disableElevation
                                        onClick={() => {
                                            setOpen(false)
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: mode ? colorsTailwind["l-workscreen-bg"] : colorsTailwind["l-secondary"],
                                            }}
                                        >
                                            Cancel
                                        </span>
                                    </Button>
                                    <Button
                                        className="grow"
                                        variant="contained"
                                        color="secondary"
                                        disableElevation
                                        onClick={handleMainActionClick}
                                        disabled={isUpdateLoading || isCreateLoading || isDeleteLoading}
                                        autoFocus
                                        endIcon={
                                            isUpdateLoading || isCreateLoading || isDeleteLoading? (
                                                <CircularProgress
                                                    color="secondary"
                                                    size={25}
                                                />
                                            ): null
                                        }
                                    >
                                        <span
                                            style={{
                                                color: mode ? colorsTailwind["l-workscreen-bg"] : colorsTailwind["l-workscreen-bg"],
                                            }}
                                        >
                                            {
                                                modalState === ModalStates.CREATE ? "Create" : null
                                            }
                                            {
                                                modalState === ModalStates.EDIT ? "Edit" : null
                                            }
                                        </span>
                                    </Button>
                                </div>
                                : (
                                    <div className=" mb-2"></div>
                                )
                        }

                    </div>

                </div>
                {/* <NoteDeleteWarningModal open={stateDeleteWarningModal} setOpen={setStateDeleteWarningModal} setDeletionConfirmation={setDeletionConfirmation} noteName={noteName} /> */}
            </Box>
        </Modal>
    );
}

export default NoteModal;