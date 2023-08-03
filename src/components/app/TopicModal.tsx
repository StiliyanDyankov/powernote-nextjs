"use client"

import { RootState } from "@/utils/store";
import { colorsTailwind } from "@/utils/themeMUI";
import { Box, Button, Divider, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useRef, useState } from "react";
import { notesDb } from "@/utils/notesDb";
import { Tab, WorkscreenTypes, createNewTab, createWorkscreen, openTopicCreationSuccessfulModal, openTopicDeleteSuccessfulModal, openTopicEditSuccessfulModal } from "@/utils/storeSlices/appSlice";
import { generateId } from "./WorkspaceView";
import Delta from "quill-delta";
import { ModalStates } from "./NoteModal";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';

export enum TopicColors {
    RED = "#f44336",
    PINK = "#e91e63",
    PURPLE = "#9c27b0",
    DEEP_PURPLE = "#673ab7",
    INDIGO = "#3f51b5",
    BLUE = "#2196f3",
    LIGHT_BLUE = "#03a9f4",
    CYAN = "#00bcd4",
    TEAL = "#009688",
    GREEN = "#4caf50",
    LIGHT_GREEN = "#8bc34a",
    LIME = "#cddc39",
    YELLOW = "#ffeb3b",
    AMBER = "#ffc107",
    ORANGE = "#ff9800",
    DEEP_ORANGE = "#ff5722"
}

export const hexToColorName: { [key: string]: string } = {
    "#f44336": "Red",
    "#e91e63": "Pink",
    "#9c27b0": "Purple",
    "#673ab7": "Deep Purple",
    "#3f51b5": "Indigo",
    "#2196f3": "Blue",
    "#03a9f4": "Light Blue",
    "#00bcd4": "Cyan",
    "#009688": "Teal",
    "#4caf50": "Green",
    "#8bc34a": "Light Green",
    "#cddc39": "Lime",
    "#ffeb3b": "Yellow",
    "#ffc107": "Amber",
    "#ff9800": "Orange",
    "#ff5722": "Deep Orange"
}

const TopicColorsArr = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
]

const TopicModal = (
    {
        initialState,
        open,
        setOpen,
        editTopicId,
    }: {
        open: boolean;
        setOpen: (state: boolean) => void;
        initialState: ModalStates;
        editTopicId?: string;
    }) => {

    const dispatch = useDispatch();

    const [modalState, setModalState] = useState<ModalStates>(initialState)

    const mode = useSelector((state: RootState) => state.theme.darkTheme);

    // const currentNumber = useRef<number>(1)

    const [topicId, setTopicId] = useState<string | null>(null)

    const [topicName, setTopicName] = useState<string>("New Topic")

    const [topicDescription, setTopicDescription] = useState<string>("")

    const [topicColor, setTopicColor] = useState<TopicColors>(TopicColors.BLUE);

    const [operationState, setOperationState] = useState<boolean>(false);

    const getCurrentNumOfDocs = async () => {
        const numOfTopics = await notesDb.topics.count();
        setTopicName(`New Topic ${numOfTopics + 1}`)
        // currentNumber.current = numOfDocs;
    }

    useEffect(() => {
        setTopicName("New Topic");
        getCurrentNumOfDocs();
        setTopicColor(TopicColors.BLUE);

        if (modalState !== ModalStates.CREATE) {
            loadTopicData();
        }
    }, [open])


    useEffect(() => {
        if (operationState && modalState === ModalStates.CREATE) {
            dispatch(openTopicCreationSuccessfulModal());
            setOpen(false);
            setOperationState(false);
        } else if (operationState && editTopicId && modalState === ModalStates.EDIT) {
            // handle successfull edit case
            dispatch(openTopicEditSuccessfulModal());
            setOperationState(false);
            setOpen(false);
        }

    }, [operationState])

    const handleChange = (event: SelectChangeEvent) => {
        setTopicColor(event.target.value as TopicColors);
    };

    const handleMainActionClick = () => {
        if(modalState === ModalStates.CREATE) {
            createNewTopic();
        } else if (modalState === ModalStates.EDIT) {
            editTopic();
        }
    }

    const editTopic = async () => {
        if (!editTopicId) {
            return;
        }

        try {
            const id = await notesDb.topics.update(editTopicId, {
                noteName: topicName,
                color: topicColor,
                description: topicDescription,
                lastModified: Date.now(),
            })
            if (id) {
                setOperationState(true);
            }
        } catch (error) {
            console.log("error with edit topic", error)
        }
    }

    const createNewTopic = async () => {
        try {
            const id = await notesDb.topics.add({
                id: generateId(),
                topicName: topicName,
                description: topicDescription,
                createdAt: Date.now(),
                lastModified: Date.now(),
                color: topicColor
            })
            if (id) {
                setOperationState(true);
            }
        } catch (error) {
            console.log("error with creating topic", error)
        }
    }

    const loadTopicData = async () => {
        if (!editTopicId) {
            return;
        }

        try {
            const topicData = await notesDb.topics.get(editTopicId);
            if (topicData) {
                setTopicName(topicData.topicName);
                setTopicDescription(topicData.description);
                setTopicColor(topicData.color as TopicColors);
            }
        } catch (error) {
            console.log("error with edit topic", error)
        }
    }

    const handleDeleteIconClick = async () => {
        if (!editTopicId) {
            return;
        }
        try {
            await notesDb.topics.delete(editTopicId);

            // const notes = await notesDb.notes.
            // await notesDb.notes.where('topics').equals(editTopicId as string).modify(note => {
            //     note.topics = note.topics.filter(id => id !== editTopicId);
            // });

            await notesDb.notes.where('topics').notEqual([]).modify(note => {
                note.topics = note.topics.filter(id => id !== editTopicId);
            });

            dispatch(openTopicDeleteSuccessfulModal());
            setOpen(false);
            
        } catch (error) {
            console.log("error with edit topic", error)
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
            key={editTopicId || topicId}
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
                    <div className="flex flex-row justify-between items-center rounded-t-lg  h-8 relative">
                        <div className="w-fit h-fit flex flex-row justify-center gap-2 items-center text-l-utility-dark dark:text-l-tools-bg z-10">
                            {
                                modalState === ModalStates.INFO ?
                                    // delete icon
                                    (
                                        <div className="flex flex-row gap-2 justify-center items-center">
                                            <Tooltip title={"Delete Topic"}>
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

                                            <Tooltip title={"Edit Topic"}>
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
                                    <Tooltip title={"Delete Topic"}>
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
                                modalState === ModalStates.CREATE ? "Create New Topic" : topicName
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
                            value={topicName}
                            disabled={modalState === ModalStates.INFO}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setTopicName(e.target.value);
                            }}
                        />

                        <Divider />

                        <TextField
                            variant="outlined"
                            color="secondary"
                            label={"Description"}
                            value={topicDescription}
                            multiline
                            disabled={modalState === ModalStates.INFO}
                            rows={4}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setTopicDescription(e.target.value);
                            }}
                        />

                        <Divider />

                        <FormControl color="secondary" className=" ">
                            <InputLabel id="demo-simple-select-label">Color</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Color"
                                value={topicColor}
                                onChange={handleChange}
                                disabled={modalState === ModalStates.INFO}
                                sx={{
                                    '& .MuiSelect-select': {
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: "0.5rem"
                                    }
                                }}
                            >
                                {TopicColorsArr.map((hex, i) => (
                                    <MenuItem key={i} value={hex} className=" flex flex-row gap-2">
                                        <div style={{
                                            backgroundColor: hex,
                                            borderRadius: 9999,
                                            width: "20px",
                                            height: "20px",
                                        }}>
                                        </div>
                                        <div>
                                            {hexToColorName[hex as TopicColors]}
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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
            </Box>
        </Modal>
    );
}

export default TopicModal;