"use client"
import { Box, Button, Chip, Divider, FormControl, Icon, IconButton, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useEffect, useMemo, useState } from "react";
import { Note, Topic, notesDb } from "@/utils/notesDb";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
        protein: number,
    ) {
    return { name, calories, fat, carbs, protein };
}
  
const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
];

const HomeWorkscreen = () => {

    const data = useMemo(()=> rows, [rows])

    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])

    const [availableNotes, setAvailableNotes] = useState<Note[]>([])

    const [selectedTopics, setSelectedTopics] = useState<string[]>([])


    const getAvailableNotes = async () => {
        const availableNotes = await notesDb.notes.toArray();
        setAvailableNotes(availableNotes);
    }

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        setAvailableTopics(availableTopics);
    }

    useEffect(()=> {
        getAvailableNotes();
        getAvailableTopics();
    }, [])

    useEffect(()=> {
        console.log("available", availableNotes, availableTopics);
    },[availableNotes, availableTopics])

    const handleChange = (event: SelectChangeEvent) => {
        console.log("topic selection event", event)
        setSelectedTopics(event.target.value as unknown as string[])
    }

    return ( 
        <div className="h-full max-w-7xl w-full rounded-b-lg p-4 flex flex-col gap-3">
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
                <FormControl color="secondary" className=" w-7/12">
                    <InputLabel id="demo-simple-select-label">Filter by Topics</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Filter by Topics"
                        multiple
                        // this is actually an array of topic ids
                        value={selectedTopics as unknown as string}
                        // input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        onChange={handleChange}
                        renderValue={(selectedTopics)=> {
                            console.log("renderValue", selectedTopics);
                            // return  (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            //             {selectedTopics.split(",").map((topicId) => {
                            //                 const topic = availableTopics.find(t => t.id === topicId) as Topic;
                            //                 return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color }}/>
                            //             })}
                            //         </Box>)
                            return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selectedTopics as unknown as Topic[]).map((topicId) => {
                                        const topic = availableTopics.find(t => t.id === topicId as unknown as string) as Topic;
                                        return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, height: "23px" }}/>
                                    })}
                                </Box>
                            )
                        }}
                        sx={{
                            '& .MuiSelect-select': {
                                display: "flex",
                                flexDirection: "row",
                                gap: "0.5rem"
                            }
                        }}
                    >
                        {availableTopics.map((topic, i) => (
                            <MenuItem key={i} value={topic.id} className=" flex flex-row gap-2">
                                <div style={{
                                    backgroundColor: topic.color,
                                    borderRadius: 9999,
                                    width: "20px",
                                    height: "20px",
                                }}>
                                </div>
                                <div>
                                    {topic.topicName}
                                </div> 
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Divider/>
            <div className=" h-full w-full flex flex-col ">
                <div className="flex flex-row justify-between items-center mb-4">
                    <p className=" font-medium text-xl  dark:text-l-workscreen-bg  leading-4">
                        Your notes:
                    </p>

                        <Tooltip title={"Refresh"} >
                        
                            <IconButton >
                                <RefreshRoundedIcon/>
                            </IconButton>
                        </Tooltip >
                </div>
                <TableContainer component={Paper} className=" bg-opacity-0 grow h-full oveflow-scroll " sx={{bgcolor:"rgba(0,0,0,0)", boxShadow: "none", maxHeight: "65vh"}}>
                    <Table stickyHeader sx={{ minWidth: 450, bgcolor: "rgba(0,0,0,0)" }} aria-label="simple table"  className=" max-h-96 overflow-scroll">
                        <TableHead className="">
                            <TableRow className="">
                                <TableCell className=" !bg-l-tools-bg dark:!bg-d-300-chips"><span className=" border border-l-divider mr-1"></span> Name</TableCell>
                                <TableCell align="right" className=" !bg-l-tools-bg dark:!bg-d-300-chips"><span className=" border border-l-divider mr-1"></span>Last Opened</TableCell>
                                <TableCell align="right" className=" !bg-l-tools-bg dark:!bg-d-300-chips"><span className=" border border-l-divider mr-1"></span>Created</TableCell>
                                <TableCell align="right" className=" !bg-l-tools-bg dark:!bg-d-300-chips"><span className=" border border-l-divider mr-1"></span>Topics</TableCell>
                                <TableCell align="right" className=" !bg-l-tools-bg dark:!bg-d-300-chips"><span className=" border border-l-divider mr-4"></span></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className=" overflow-hidden max-h-96">
                            {data.map((row, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    className="hover:bg-primary/10"
                                >
                                    <TableCell component="th" scope="row">
                                        <span className=" form-text hover:underline hover:cursor-pointer">
                                            {row.name}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">{row.carbs}</TableCell>
                                    <TableCell align="right">
                                        <IconButton sx={{ width: "1.5rem", height: "1.5rem"}}>
                                            <MoreVertRoundedIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="flex flex-row justify-around mt-2 dark:text-l-workscreen-bg">
                    <div className=" text-sm">Documents total: <span className=" font-semibold">89</span></div>
                    <div className=" text-sm">Last sync: <span className=" font-semibold">Two minutes ago</span></div>
                </div>
            </div>
        </div>
    );
}
 
export default HomeWorkscreen;