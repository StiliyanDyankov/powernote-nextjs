"use client"
import { Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useEffect, useMemo, useState } from "react";
import { Note, Topic, notesDb } from "@/utils/notesDb";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { HomeContent, Workscreen, WorkscreenTypes, createNewTab, createWorkscreen, setSelectedTopicsHome } from "@/utils/storeSlices/appSlice";
import { RootState } from "@/utils/store";
import TopicSelector from "./TopicSelector";

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

    // const [selectedTopics, setSelectedTopics] = useState<string[]>([])

    const selectedTopics = (workscreenContext.content as HomeContent).selectedTopics;

    const [refreshFlag, setRefreshFlag] = useState<boolean>(true)

    const memoizedNotes = useMemo(()=> availableNotes, [availableNotes])

    const getAvailableNotes = async () => {
        let availableNotes = await notesDb.notes.toArray();
        let processedNotes = availableNotes.map((note)=> {
            const { content, ...rest } = note;
            return rest
        })
        setAvailableNotes(processedNotes);
    }

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        setAvailableTopics(availableTopics);
    }

    const setSelectedTopics = (newVal: string[]) => {
        dispatch(setSelectedTopicsHome({ inTabId: tabId, workscreenId: workscreenContext.id, newValue: newVal}))
    }

    useEffect(()=> {
        if(refreshFlag) {
            getAvailableTopics();
            getAvailableNotes();
            setRefreshFlag(false);
        }
    }, [refreshFlag])

    useEffect(()=> {
        console.log("available", availableNotes, availableTopics);
    },[availableNotes, availableTopics])

    // const handleChange = (event: SelectChangeEvent) => {
    //     setSelectedTopics(event.target.value as unknown as string[])
    // }

    const handleEditNote = (noteId: string) => {
        console.log(noteId)
    }

    const handleRefresh = () => {
        setRefreshFlag(true);
    }

    const handleNoteNameClick = (noteId: string, noteName: string) => {
        if(currentWorkspace?.workscreens && currentWorkspace?.workscreens.length < 2) {
            // create new note

            dispatch(createWorkscreen({inTabId: tabId, type: WorkscreenTypes.NOTE, options: {noteId: noteId}}))
        } else {
            // create new note

            dispatch(createNewTab({tabName: noteName, workscreen: { type: WorkscreenTypes.NOTE, content: { noteId: noteId }}}))
        }
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
                            borderRadius:9999,
                            textTransform: "none",
                            fontWeight: "300",
                            height: "40px"
                        }}
                        startIcon={
                            <AddRoundedIcon className="dark:fill-l-workscreen-bg"/>
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
                            borderRadius:9999,
                            textTransform: "none",
                            fontWeight: "300",
                            height: "40px"
                        }}
                        startIcon={
                            <AddRoundedIcon className="dark:fill-l-workscreen-bg"/>
                        }
                    >
                        <span className=" dark:text-l-workscreen-bg">
                            New Topic
                        </span>
                    </Button>
                </div>
                <Divider orientation="vertical"/>
                <div  className=" w-7/12">
                    <TopicSelector refreshFlag={refreshFlag} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} />
                </div>
            </div>
            <Divider/>
            <div className=" h-full w-full flex flex-col ">
                <div className="flex flex-row justify-between items-center mb-4">
                    <p className=" font-medium text-xl  dark:text-l-workscreen-bg  leading-4">
                        Your notes:
                    </p>

                        <Tooltip title={"Refresh"} >
                            <IconButton onClick={() => { handleRefresh() }}>
                                <RefreshRoundedIcon/>
                            </IconButton>
                        </Tooltip >
                </div>
                <TableContainer component={Paper} className=" bg-opacity-0 grow h-full oveflow-scroll " sx={{bgcolor:"rgba(0,0,0,0)", boxShadow: "none", maxHeight: "65vh"}} >
                    <Table stickyHeader sx={{ minWidth: 450, bgcolor: "rgba(0,0,0,0)" }} aria-label="simple table"  className=" max-h-96" >
                        <TableHead className="">
                            <TableRow className="">
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%"}}><span className=" border border-l-divider mr-1"></span> Name</TableCell>
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%"}}><span className=" border border-l-divider mr-1"></span>Last Modified</TableCell>
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%"}}><span className=" border border-l-divider mr-1"></span>Created</TableCell>
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%"}}><span className=" border border-l-divider mr-1"></span>Topics</TableCell>
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "4%"}}><span className=" border border-l-divider mr-4"></span></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className=" overflow-hidden max-h-96">
                            {memoizedNotes.map((note, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    className="hover:bg-primary/10"
                                >
                                    <TableCell component="th" scope="row" style={{ width: "24%"}}>
                                        <span className=" form-text hover:underline hover:cursor-pointer" onClick={()=> { handleNoteNameClick(note.id as string, note.noteName) }}>
                                            {note.noteName}
                                        </span>
                                    </TableCell>
                                    <TableCell style={{ width: "24%"}}>{moment.duration(Date.now() - note.lastModified).humanize() + " ago"}</TableCell>
                                    <TableCell style={{ width: "24%"}}>{moment.duration(Date.now() - note.createdAt).humanize() + " ago"}</TableCell>
                                    <TableCell style={{ width: "24%"}}>
                                        {
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(note.topics as unknown as Topic[]).map((topicId) => {
                                                    const topic = availableTopics.find(t => t.id === topicId as unknown as string) as Topic;
                                                    return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, height: "23px", color: "black" }}/>
                                                })}
                                            </Box>
                                        }
                                    </TableCell>
                                    <TableCell style={{ width: "4%"}}>
                                        <Tooltip title={"Edit Note"}>
                                            <IconButton sx={{ width: "1.5rem", height: "1.5rem"}} onClick={() => { handleEditNote(note.id as string) }}>
                                                <MoreVertRoundedIcon/>
                                            </IconButton>
                                        </Tooltip>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex flex-row justify-around mt-2 dark:text-l-workscreen-bg">
                    <div className=" text-sm">Documents total: <span className=" font-semibold">{availableNotes.length}</span></div>
                    <div className=" text-sm">Last sync: <span className=" font-semibold">Two minutes ago</span></div>
                </div>
            </div>
        </div>
    );
}
 
export default HomeWorkscreen;