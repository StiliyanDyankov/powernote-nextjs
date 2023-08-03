"use client"
import { Alert, Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, ThemeProvider, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useEffect, useMemo, useState } from "react";
import { Note, Topic, notesDb } from "@/utils/notesDb";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { HomeContent, TableTabStates, Workscreen, WorkscreenTypes, closeNoteDeleteSuccessfulModal, closeNoteEditSuccessfulModal, closeTopicDeleteSuccessfulModal, closeTopicEditSuccessfulModal, createNewTab, createWorkscreen, openClosingWorkscreenModal, setFlexsearchSyncState, setSelectedTableTabHome, setSelectedTopicsHome } from "@/utils/storeSlices/appSlice";
import { RootState } from "@/utils/store";
import TopicSelector from "./TopicSelector";
import _ from "lodash"
import NoteListTable from "./NoteListTable";
import TopicListTable from "./TopicListTable";
import CloseIcon from '@mui/icons-material/Close';
import NoteModal, { ModalStates } from "./NoteModal";
import TopicModal from "./TopicModal";
import { darkTheme, lightTheme } from "@/utils/themeMUI";

export interface NoteWithoutDesc {
    id?: string;
    noteName: string;
    topics: string[];
    description: string;
    createdAt: number;
    lastModified: number;
}

const HomeWorkscreen = ({
    tabId,
    workscreenContext
}: {
    tabId: number;
    workscreenContext: Workscreen
}) => {

    const dispatch = useDispatch();

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));

    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])

    const [availableNotes, setAvailableNotes] = useState<NoteWithoutDesc[]>([])

    const [displayedNotes, setDisplayedNotes] = useState<NoteWithoutDesc[]>([]);

    const selectedTopics = (workscreenContext.content as HomeContent).selectedTopics;
    const tabValue = (workscreenContext.content as HomeContent).selectedTableTab

    const [refreshFlag, setRefreshFlag] = useState<boolean>(true)

    const memoizedNotes = useMemo(() => availableNotes, [availableNotes])

    const mode = useSelector((state: RootState) => state.theme.darkTheme);

    // snackbar states

    const stateTopicEditSuccessfulModal = useSelector((state: RootState) => state.app.topicEditSuccessfulModal)
    const stateTopicDeleteSuccessfulModal = useSelector((state: RootState) => state.app.topicDeleteSuccessfulModal)
    
    const stateNoteEditSuccessfulModal = useSelector((state: RootState) => state.app.noteEditSuccessfulModal)
    const stateNoteDeleteSuccessfulModal = useSelector((state: RootState) => state.app.noteDeleteSuccessfulModal)

    const syncState = useSelector((state: RootState) => state.app.flexsearchSync)

    const getAvailableNotes = async () => {
        let availableNotes = await notesDb.notes.toArray();
        let processedNotes = availableNotes.map((note) => {
            const { content, ...rest } = note;
            return rest
        });
        setAvailableNotes(processedNotes);
    }

    dispatch(setFlexsearchSyncState({
        syncState: true,
        details: null,
    }));


    const sortByModify = (
        arr: {
            [key: string]: any;
            lastModified: number;
        }[]) => {
        arr.sort((a, b) => b.lastModified - a.lastModified);
        console.log("sorted arr", arr);
    }

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        sortByModify(availableTopics)
        setAvailableTopics(availableTopics);
    }

    const setSelectedTopics = (newVal: string[]) => {
        dispatch(setSelectedTopicsHome({ inTabId: tabId, workscreenId: workscreenContext.id, newValue: newVal }))
    }


    const [openNoteModal, setOpenNoteModal] = useState(false)

    const [openTopicModal, setOpenTopicModal] = useState(false)

    const [inNewTab, setInNewTab] = useState<boolean>(false);

    useEffect(() => {
        if (refreshFlag) {
            getAvailableTopics();
            getAvailableNotes();
            setRefreshFlag(false);
        } 
        else if(!syncState) {
            getAvailableTopics();
            getAvailableNotes();
        }
    }, [refreshFlag, syncState])

    useEffect(() => {
        console.log("available", availableNotes, availableTopics);
    }, [memoizedNotes, availableTopics])

    useEffect(() => {
        let intAvailableNotes = [...memoizedNotes]
        sortByModify(intAvailableNotes);

        // filter based on selected topics
        intAvailableNotes = intAvailableNotes.filter(obj => {
            return _.difference(selectedTopics, obj.topics).length === 0;
        });

        setDisplayedNotes(intAvailableNotes)
    }, [memoizedNotes, selectedTopics])

    const handleRefresh = () => {
        setRefreshFlag(true);
    }

    const handleNoteNameClick = (noteId: string, noteName: string) => {
        if (currentWorkspace?.workscreens && currentWorkspace?.workscreens.length < 2) {
            // create new note

            dispatch(createWorkscreen({ inTabId: tabId, type: WorkscreenTypes.NOTE, options: { noteId: noteId } }))
        } else {
            // create new note

            dispatch(createNewTab({ tabName: noteName, workscreen: { type: WorkscreenTypes.NOTE, content: { noteId: noteId } } }))
        }
    }

    const handleTableTabClick = (event: React.SyntheticEvent, newValue: TableTabStates) => {
        dispatch(setSelectedTableTabHome({ inTabId: tabId, workscreenId: workscreenContext.id, newValue: newValue }))

        // setTabValue(newValue);
    }

    const handleNoteClick = () => {
        if(currentWorkspace?.workscreens.length === 2) {
            dispatch(openClosingWorkscreenModal());
            return;
        }

        if(currentWorkspace) {
            // create new note
            setInNewTab(true);
            setOpenNoteModal(true)
        } else {
            // create new note
            setInNewTab(true);
            setOpenNoteModal(true)
        }
    }
    
    const handleTopicClick = () => {
        setOpenTopicModal(true)
    }

    return (
        <div className="h-full max-w-7xl w-full rounded-b-lg p-4 flex flex-col gap-3" key={workscreenContext.id}>
            {/* home header */}
            <div className=" w-full flex flex-row gap-2 px-2 justify-around">
                {/* buttons */}
                <div className="flex flex-row gap-2 items-center grow justify-around">
                    <Button
                        color="secondary"
                        variant="contained"
                        disableElevation
                        sx={{
                            borderRadius: 9999,
                            textTransform: "none",
                            fontWeight: "300",
                            height: "40px"
                        }}
                        startIcon={
                            <AddRoundedIcon className="dark:fill-l-workscreen-bg" />
                        }
                        onClick={handleNoteClick}
                    >
                        <span className=" dark:text-l-workscreen-bg">
                            New Note
                        </span>
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        disableElevation
                        sx={{
                            borderRadius: 9999,
                            textTransform: "none",
                            fontWeight: "300",
                            height: "40px"
                        }}
                        startIcon={
                            <AddRoundedIcon className="dark:fill-l-workscreen-bg" />
                        }
                        onClick={handleTopicClick}
                    >
                        <span className=" dark:text-l-workscreen-bg">
                            New Topic
                        </span>
                    </Button>
                </div>
                <Divider orientation="vertical" />
                <div className=" w-7/12">
                    <TopicSelector refreshFlag={refreshFlag} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />
                </div>
            </div>
            <Divider />
            <div className=" h-full w-full flex flex-col ">

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', position: "relative", width: "100%", zIndex: 0 }}>
                        <Tabs value={tabValue} onChange={handleTableTabClick} aria-label="basic tabs example" className=" z-10" textColor="secondary" sx={{ textTransform: "none" }}>
                            <Tab label="Your Notes" value={TableTabStates.NOTES} id="Tab1" sx={{ textTransform: "none", fontSize: "1.2rem" }} />
                            <Tab label="Your Topics" value={TableTabStates.TOPICS} id="Tab2" sx={{ textTransform: "none", fontSize: "1.2rem" }} />
                        </Tabs>


                        <div className="absolute right-0 top-0">
                            <Tooltip title={"Refresh"} >
                                <IconButton onClick={() => { handleRefresh() }} >
                                    <RefreshRoundedIcon />
                                </IconButton>
                            </Tooltip >
                        </div>

                    </Box>
                    <div
                        role="tabpanel"
                        className=" mt-2"
                        hidden={tabValue !== TableTabStates.NOTES}
                        id={`simple-tabpanel-${TableTabStates.NOTES}`}
                    >
                        <NoteListTable displayedNotes={displayedNotes} availableTopics={availableTopics} handleNoteNameClick={handleNoteNameClick} availableNotes={availableNotes} />
                    </div>
                    <div
                        role="tabpanel"
                        className=" mt-2"
                        hidden={tabValue !== TableTabStates.TOPICS}
                        id={`simple-tabpanel-${TableTabStates.TOPICS}`}
                    >
                        <TopicListTable displayedNotes={displayedNotes} availableTopics={availableTopics}/>
                    </div>
                </Box>
            </div>
            <ThemeProvider theme={mode ? darkTheme : lightTheme}>
                <NoteModal open={openNoteModal} setOpen={setOpenNoteModal} currentWorkspace={currentWorkspace} createInNewTab={inNewTab}  initialState={ModalStates.CREATE}/>
                <TopicModal open={openTopicModal} setOpen={setOpenTopicModal}  initialState={ModalStates.CREATE}/>
            </ThemeProvider>
            <Snackbar
                open={stateNoteDeleteSuccessfulModal}
                autoHideDuration={5000}
                message={"Note deleted successfully"}
                onClose={() => {
                    dispatch(closeNoteDeleteSuccessfulModal());
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={() => {
                            dispatch(closeNoteDeleteSuccessfulModal());
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
                        dispatch(closeNoteDeleteSuccessfulModal());
                    }}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Note deleted successfully
                </Alert>
            </Snackbar>

            <Snackbar
                open={stateNoteEditSuccessfulModal}
                autoHideDuration={5000}
                message={"Note edited successfully"}
                onClose={() => {
                    dispatch(closeNoteEditSuccessfulModal());
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={() => {
                            dispatch(closeNoteEditSuccessfulModal());
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
                        dispatch(closeNoteEditSuccessfulModal());
                    }}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Note edited successfully
                </Alert>
            </Snackbar>

            <Snackbar
                open={stateTopicDeleteSuccessfulModal}
                autoHideDuration={5000}
                message={"Topic deleted successfully"}
                onClose={() => {
                    dispatch(closeTopicDeleteSuccessfulModal());
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={() => {
                            dispatch(closeTopicDeleteSuccessfulModal());
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
                        dispatch(closeTopicDeleteSuccessfulModal());
                    }}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Topic deleted successfully
                </Alert>
            </Snackbar>

            <Snackbar
                open={stateTopicEditSuccessfulModal}
                autoHideDuration={5000}
                message={"Topic edited successfully"}
                onClose={() => {
                    dispatch(closeTopicEditSuccessfulModal());
                }}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                        onClick={() => {
                            dispatch(closeTopicEditSuccessfulModal());
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
                        dispatch(closeTopicEditSuccessfulModal());
                    }}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Topic edited successfully
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HomeWorkscreen;