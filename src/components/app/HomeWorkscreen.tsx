"use client"
import { Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useEffect, useMemo, useState } from "react";
import { Note, Topic, notesDb } from "@/utils/notesDb";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { HomeContent, TableTabStates, Workscreen, WorkscreenTypes, createNewTab, createWorkscreen, setSelectedTableTabHome, setSelectedTopicsHome } from "@/utils/storeSlices/appSlice";
import { RootState } from "@/utils/store";
import TopicSelector from "./TopicSelector";
import _ from "lodash"
import NoteListTable from "./NoteListTable";
import TopicListTable from "./TopicListTable";

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

    // const [selectedTopics, setSelectedTopics] = useState<string[]>([])

    const selectedTopics = (workscreenContext.content as HomeContent).selectedTopics;
    const tabValue = (workscreenContext.content as HomeContent).selectedTableTab

    const [refreshFlag, setRefreshFlag] = useState<boolean>(true)

    const memoizedNotes = useMemo(() => availableNotes, [availableNotes])

    // const [tabValue, setTabValue] = useState<TableTabStates>(TableTabStates.NOTES)

    const getAvailableNotes = async () => {
        let availableNotes = await notesDb.notes.toArray();
        let processedNotes = availableNotes.map((note) => {
            const { content, ...rest } = note;
            return rest
        });
        setAvailableNotes(processedNotes);

    }

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
        setAvailableTopics(availableTopics);
    }

    const setSelectedTopics = (newVal: string[]) => {
        dispatch(setSelectedTopicsHome({ inTabId: tabId, workscreenId: workscreenContext.id, newValue: newVal }))
    }

    useEffect(() => {
        if (refreshFlag) {
            getAvailableTopics();
            getAvailableNotes();
            setRefreshFlag(false);
        }
    }, [refreshFlag])

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

    const handleEditNote = (noteId: string) => {
        console.log(noteId)
    }

    const handleEditTopic = (topicId: string) => {
        console.log(topicId)
    }

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

                {/* <NoteListTable displayedNotes={displayedNotes} availableTopics={availableTopics} handleNoteNameClick={handleNoteNameClick} handleEditNote={handleEditNote} availableNotes={availableNotes}/>
                <TopicListTable displayedNotes={displayedNotes} availableTopics={availableTopics} handleNoteNameClick={handleNoteNameClick} handleEditNote={handleEditNote} /> */}

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
                        <NoteListTable displayedNotes={displayedNotes} availableTopics={availableTopics} handleNoteNameClick={handleNoteNameClick} handleEditNote={handleEditNote} availableNotes={availableNotes} />
                    </div>
                    <div
                        role="tabpanel"
                        className=" mt-2"
                        hidden={tabValue !== TableTabStates.TOPICS}
                        id={`simple-tabpanel-${TableTabStates.TOPICS}`}
                    >
                        <TopicListTable displayedNotes={displayedNotes} availableTopics={availableTopics} handleEditNote={handleEditNote} />
                    </div>
                </Box>
            </div>
        </div>
    );
}

export default HomeWorkscreen;