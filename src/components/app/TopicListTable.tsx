"use client"

import { Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Tooltip } from "@mui/material";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Topic } from "@/utils/notesDb";
import moment from "moment";
import _ from "lodash"
import { NoteWithoutDesc } from "./HomeWorkscreen";
import TopicModal, { hexToColorName } from "./TopicModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { darkTheme, lightTheme } from "@/utils/themeMUI";
import { ModalStates } from "./NoteModal";

const TopicListTable = ({
    availableTopics,
}: {
    availableTopics: Topic[];
}) => {

    const [openTopicModal, setOpenTopicModal] = useState<boolean>(false);
    const [modalOpenFor, setModalOpenFor] = useState<string | null>(null);
    const mode = useSelector((state: RootState) => state.theme.darkTheme);
    
    return (
        <div>
            <TableContainer component={Paper} className=" bg-opacity-0 grow h-full oveflow-scroll " sx={{ bgcolor: "rgba(0,0,0,0)", boxShadow: "none", maxHeight: "65vh" }} >
                <Table stickyHeader sx={{ minWidth: 450, bgcolor: "rgba(0,0,0,0)" }} aria-label="simple table" className=" max-h-96" >
                    <TableHead className="">
                        <TableRow className="">
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "24%" }}><span className=" border border-l-divider mr-1"></span>Name</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Last Modified</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "20%" }}><span className=" border border-l-divider mr-1"></span>Created</TableCell>
                            <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips" style={{ width: "32%" }}><span className=" border border-l-divider mr-1"></span>Description</TableCell>
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
                                    <Tooltip title={topic.description}>
                                        <p>
                                            {topic.description}
                                        </p>
                                    </Tooltip>
                                </TableCell>
                                <TableCell style={{ width: "4%" }}>
                                    <Tooltip title={"Edit Topic"}>
                                        <IconButton sx={{ width: "1.5rem", height: "1.5rem" }} onClick={() => { 
                                            setOpenTopicModal(true);
                                            setModalOpenFor(topic.id as string);
                                        }}>
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
            <ThemeProvider theme={mode ? darkTheme : lightTheme}>
                <TopicModal open={openTopicModal} setOpen={setOpenTopicModal} key={Math.random() * 100000} initialState={ModalStates.INFO} editTopicId={modalOpenFor as string} />
            </ThemeProvider>
        </div>
    );
}

export default TopicListTable;