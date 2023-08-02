"use client"
import { Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Topic } from "@/utils/notesDb";
import moment from "moment";
import _ from "lodash"
import { NoteWithoutDesc } from "./HomeWorkscreen";

const NoteListTable = ({
    availableNotes,
    displayedNotes,
    availableTopics,
    handleNoteNameClick,
    handleEditNote
}: {
    availableNotes: NoteWithoutDesc[];
    displayedNotes: NoteWithoutDesc[];
    availableTopics: Topic[];
    handleNoteNameClick: (noteId: string, noteName: string) => void;
    handleEditNote: (noteId: string) => void;
}) => {
    return (
        <div>
            <TableContainer component={Paper} className=" bg-opacity-0 grow h-full oveflow-scroll " sx={{ bgcolor: "rgba(0,0,0,0)", boxShadow: "none", maxHeight: "65vh" }} >
                <Table stickyHeader sx={{ minWidth: 450, bgcolor: "rgba(0,0,0,0)" }} aria-label="simple table" className=" max-h-96" >
                    <TableHead className="">
                        <TableRow className="">
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%" }}><span className=" border border-l-divider mr-1"></span> Name</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Last Modified</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Created</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "32%" }}><span className=" border border-l-divider mr-1"></span>Topics</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "4%" }}><span className=" border border-l-divider mr-4"></span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className=" overflow-hidden max-h-96">
                        {displayedNotes.map((note, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="hover:bg-primary/10"
                            >
                                <TableCell component="th" scope="row" style={{ width: "24%" }}>
                                    <span className=" form-text hover:underline hover:cursor-pointer" onClick={() => { handleNoteNameClick(note.id as string, note.noteName) }}>
                                        {note.noteName}
                                    </span>
                                </TableCell>
                                <TableCell style={{ width: "20%" }}>{moment.duration(Date.now() - note.lastModified).humanize() + " ago"}</TableCell>
                                <TableCell style={{ width: "20%" }}>{moment.duration(Date.now() - note.createdAt).humanize() + " ago"}</TableCell>
                                <TableCell style={{ width: "32%" }}>
                                    {
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(note.topics as unknown as Topic[]).map((topicId) => {
                                                const topic = availableTopics.find(t => t.id === topicId as unknown as string) as Topic;
                                                return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, height: "23px", color: "black" }} />
                                            })}
                                        </Box>
                                    }
                                </TableCell>
                                <TableCell style={{ width: "4%" }}>
                                    <Tooltip title={"Edit Note"}>
                                        <IconButton sx={{ width: "1.5rem", height: "1.5rem" }} onClick={() => { handleEditNote(note.id as string) }}>
                                            <MoreVertRoundedIcon />
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
    );
}

export default NoteListTable;