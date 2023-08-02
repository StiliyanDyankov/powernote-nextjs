"use client"
import { Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Topic } from "@/utils/notesDb";
import moment from "moment";
import _ from "lodash"
import { NoteWithoutDesc } from "./HomeWorkscreen";
import { hexToColorName } from "./TopicModal";

const TopicListTable = ({
    displayedNotes,
    availableTopics,
    handleEditNote
}: {
    displayedNotes: NoteWithoutDesc[];
    availableTopics: Topic[];
    handleEditNote: (topicId: string) => void;
}) => {
    return (
        <div>
            <TableContainer component={Paper} className=" bg-opacity-0 grow h-full oveflow-scroll " sx={{ bgcolor: "rgba(0,0,0,0)", boxShadow: "none", maxHeight: "65vh" }} >
                <Table stickyHeader sx={{ minWidth: 450, bgcolor: "rgba(0,0,0,0)" }} aria-label="simple table" className=" max-h-96" >
                    <TableHead className="">
                        <TableRow className="">
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%" }}><span className=" border border-l-divider mr-1"></span>Name</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Last Modified</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Created</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "32%" }}><span className=" border border-l-divider mr-1"></span>Color</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "4%" }}><span className=" border border-l-divider mr-4"></span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className=" overflow-hidden max-h-96">
                        {availableTopics.map((topic, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                className="hover:bg-primary/10"
                            >
                                <TableCell component="th" scope="row" style={{ width: "24%" }}>
                                    <span className=" form-text select-none">
                                        <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, color: "black" }}/>
                                    </span>
                                </TableCell>
                                <TableCell style={{ width: "20%" }}>{moment.duration(Date.now() - topic.lastModified).humanize() + " ago"}</TableCell>
                                <TableCell style={{ width: "20%" }}>{moment.duration(Date.now() - topic.createdAt).humanize() + " ago"}</TableCell>
                                <TableCell style={{ width: "32%" }}>
                                    <Tooltip title={hexToColorName[topic.color]}>
                                        <div className=" w-7 h-7 rounded-full" style={{ backgroundColor: topic.color}}>

                                        </div>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ width: "4%" }}>
                                    <Tooltip title={"Edit Topic"}>
                                        <IconButton sx={{ width: "1.5rem", height: "1.5rem" }} onClick={() => { handleEditNote(topic.id as string) }}>
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
                <div className=" text-sm">Topics total: <span className=" font-semibold">{availableTopics.length}</span></div>
                <div className=" text-sm">Last sync: <span className=" font-semibold">Two minutes ago</span></div>
            </div>
        </div>
    );
}

export default TopicListTable;