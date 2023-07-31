"use client"

import { RootState } from "@/utils/store";
import { colorsTailwind } from "@/utils/themeMUI";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useRef, useState } from "react";
import { notesDb } from "@/utils/notesDb";
import { Tab, WorkscreenTypes, createNewTab, createWorkscreen } from "@/utils/storeSlices/appSlice";
import { generateId } from "./WorkspaceView";
import Delta from "quill-delta";
// import "@/styles/globals.css";



const NoteModal = (
    {
        open,
        setOpen,
        currentWorkspace, 
    }: {
        open: boolean;
        setOpen: (state: boolean) => void;
        currentWorkspace: Tab | undefined
    }) => {

    const dispatch = useDispatch();
        
    const mode = useSelector((state: RootState) => state.theme.darkTheme);
    
    const currentNumber = useRef<number>(1)
    
    const [noteName, setNoteName] = useState<string>("New Note")

    const [noteDescription, setNoteDescription] = useState<string>("")
    
    
    const getCurrentNumOfDocs = async () => {
        const numOfDocs = await notesDb.notes.count();
        setNoteName(`New Note ${numOfDocs}`)
        // currentNumber.current = numOfDocs;
    }

    const createNewNote = async () => {
        try {
            const id = notesDb.notes.add({
                id: generateId(),
                noteName: noteName,
                topics: [],
                description: "",
                createdAt: Date.now(),
                lastModified: Date.now(),
                content: new Delta()
            })
            setOpen(false);
        } catch (error) {
            console.log("error with creating note", error)
        }
    }

    useEffect(()=> {
        getCurrentNumOfDocs();
        setNoteName("New Note");
    }, [open])

    const handleMainActionClick = () => {
        createNewNote();
        if(currentWorkspace) {
            // create new note

            dispatch(createWorkscreen({inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.NOTE}))
        } else {
            // create new note

            // const initName = "some nofnsadfjdaslfkjasldf";

            dispatch(createNewTab(noteName))
        }
    }

    return ( 
        

            <Modal 
                open={open}
                onClose={()=> {
                    setOpen(false)
                }}
                sx={{
                    fontFamily: "Quicksand, sans-serfi"
                }}
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
                            backgroundColor: mode ? colorsTailwind["d-300-chips"]: colorsTailwind["l-workscreen-bg"],
                            color: mode ? colorsTailwind["l-workscreen-bg"] : colorsTailwind["l-secondary"],
                        }}
                    >
                        <div className="flex flex-row justify-between items-center rounded-t-lg  h-8 relative">
                            <div className="w-fit h-fit flex flex-row justify-center gap-2 items-center text-l-utility-dark dark:text-l-tools-bg z-10">
                            </div>
                            <div className=" font-medium text-lg">
                                Create New Note
                            </div>
                            <div className="w-fit h-fit z-10">
                                <IconButton 
                                    sx={{ width: "1.5rem", height: "1.5rem"}}
                                    onClick={()=> {
                                        setOpen(false);
                                    }}
                                >
                                    <CloseRoundedIcon className=''/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="px-2 flex flex-col gap-4 ">

                            <TextField
                                variant="outlined"
                                color="secondary"
                                label={true? "Name": ""}
                                // disabled
                                value={noteName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setNoteName(e.target.value);
                                }}
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
                            />

                            <Divider />

                            <FormControl color="secondary" className=" ">
                                <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Topic"
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>  

                            {/* <div className="font-medium text-xl mb-4 dark:text-l-workscreen-bg">
                                some text
                            </div>

                            <Button>hihe</Button>
                             */}

                            <div className="flex flex-row gap-2 pb-2">
                                <Button
                                    className="grow"
                                    variant="outlined"
                                    color="secondary"
                                    disableElevation
                                    onClick={()=> {
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
                                >
                                    <span 
                                        style={{
                                            color: mode ? colorsTailwind["l-workscreen-bg"] : colorsTailwind["l-workscreen-bg"],
                                        }}
                                    >
                                        Create
                                    </span>
                                </Button>
                            </div>
                        </div>

                    </div>
                </Box>
            </Modal> 
    );
}
 
export default NoteModal;