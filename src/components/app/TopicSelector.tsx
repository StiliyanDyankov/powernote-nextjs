"use client"

import { Topic, notesDb } from "@/utils/notesDb"; 
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";

const TopicSelector = ({
        disabled = false,
        refreshFlag = false,
        selectedTopics,
        setSelectedTopics,
    }: {
        disabled?: boolean;
        refreshFlag?: boolean;
        selectedTopics: string[];
        setSelectedTopics: (values: string[]) => void
    }) => {

    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        setAvailableTopics(availableTopics);
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedTopics(event.target.value as unknown as string[])
    }

    useEffect(()=> {
        getAvailableTopics();
    }, [])

    useEffect(()=> {
        if(refreshFlag) {
            getAvailableTopics();
        }
    }, [refreshFlag])

    return ( 
        <FormControl color="secondary" className="w-full">
            <InputLabel id="demo-simple-select-label">Filter by Topics</InputLabel>
            <Select
                disabled={disabled}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Filter by Topics"
                multiple
                // this is actually an array of topic ids
                value={selectedTopics as unknown as string}
                onChange={handleChange}
                renderValue={(selectedTopics)=> {
                    return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selectedTopics as unknown as Topic[]).map((topicId) => {
                                const topic = availableTopics.find(t => t.id === topicId as unknown as string) as Topic;
                                if(topic) {
                                    return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, height: "23px", color: "black" }}/>
                                }
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
                        <div key={i} style={{
                            backgroundColor: topic.color,
                            borderRadius: 9999,
                            width: "20px",
                            height: "20px",
                        }}>
                        </div>
                        <div key={i}>
                            {topic.topicName}
                        </div> 
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
 
export default TopicSelector;