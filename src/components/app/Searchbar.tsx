"use client"

import { Box, Chip, Divider, OutlinedInput, Skeleton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { WorkscreenTypes, clearSearchString, createNewTab, createWorkscreen, inputSearchString, setFlexsearchSyncState } from "@/utils/storeSlices/appSlice";
import { index } from "@/pages/app";
import { Note, Topic, notesDb } from "@/utils/notesDb";
import moment from "moment";
import _ from "lodash"

interface NoteSearchRes {
    id: string;
    doc: {
        id: string;
        noteName: string;
        content: string;
    }
}

interface ResElementFirstClass {
    field: "noteName" | "content",
    result: NoteSearchRes[]
}

interface DisplaySearchResNote {
    id: string;
    noteName: string;
    matchIn: "content" | "name";
    topics: string[];
    lastModified: number;
    content?: string;
}

interface SearchResult extends Array<ResElementFirstClass> { };

const Searchbar = () => {


    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));

    const [searchBarFocus, setSearchBarFocus] = useState<boolean>(false)

    const [notesFromDb, setNotesFromDb] = useState<Note[]>([]);

    const [availableTopics, setAvailableTopics] = useState<Topic[]>([])

    const [resultsReady, setResultsReady] = useState<boolean>(false);

    const [dum, setDum] = useState<boolean>(false);

    const dispatch = useDispatch();

    const storeSearchString = useSelector((state: RootState) => state.app.searchString)

    const notesSyncState = useSelector((state: RootState) => state.app.flexsearchSync)

    const inputRef = useRef(null);

    const matchedWordIndex = useRef<number>(0);
    
    const searchResRef = useRef(null);

    const searchStr = useRef<string>();

    const displayedSearchRes2 = useRef<DisplaySearchResNote[]>();

    const [searchRes, setSearchRes] = useState<SearchResult>([])

    const [displayedSearchRes, setDisplayedSearchRes] = useState<DisplaySearchResNote[]>([])

    const loadNotes = async () => {
        setNotesFromDb(await notesDb.notes.toArray())
    }

    const getAvailableTopics = async () => {
        const availableTopics = await notesDb.topics.toArray();
        setAvailableTopics(availableTopics);
    }

    useEffect(() => {
        loadNotes();
        getAvailableTopics();
    }, [])

    useEffect(()=> {
        if(!notesSyncState) {

            dispatch(setFlexsearchSyncState({syncState: true, details: null}))
        }
    }, [notesSyncState])

    useEffect(()=> {
        setDum(!dum)
    },[displayedSearchRes]);

    useEffect(() => {
        if (searchBarFocus) {
            if (storeSearchString.length === 0) {
                gsap.to(searchResRef.current, { height: 50, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)", duration: 0.5 })
            } else {
                gsap.fromTo(searchResRef.current, { height: 35, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0)" }, { height: 300, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)", duration: 0.5 })
            }
        } else {
            gsap.to(searchResRef.current, { height: 35, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0)", duration: 0.5 })
        }
    }, [searchBarFocus])

    // some abomination
    function handleFocusOut(event: any) {
        if (event.relatedTarget
            && (event.relatedTarget.id === "searchbar"
                || event.relatedTarget as HTMLElement === searchResRef.current
                || (searchResRef.current as unknown as HTMLElement).contains((event.relatedTarget as HTMLElement)))) {
            return;
        } else {
            setSearchBarFocus(false);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setResultsReady(true);
        }, 2000);
    }, [displayedSearchRes])

    useEffect(() => {
        if (storeSearchString.length < 1) {
            setSearchRes([]);
        }
        if (storeSearchString.length === 0 && searchBarFocus) {
            setResultsReady(false);
            gsap.to(searchResRef.current, { height: 50, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)", duration: 0.5 })
        } else if (storeSearchString.length !== 0 && searchBarFocus) {
            gsap.to(searchResRef.current, { height: 300, boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.4)", duration: 0.5 })
        }
    }, [storeSearchString])

    useEffect(() => {
        if (notesFromDb.length !== 0) {

            if (searchRes.length !== 0) {

                let addedNoteIds: string[] = [];

                if (searchRes[0].field === "noteName") {
                    // exec if match in name
                    let intResArr: DisplaySearchResNote[] = [];
                    
                    searchRes[0].result.forEach((res) => {
                        if (!addedNoteIds.includes(res.id)) {
                            intResArr.push({
                                id: res.id,
                                noteName: res.doc.noteName,
                                matchIn: "name",
                                topics: notesFromDb.find(n => n.id === res.id)?.topics as string[],
                                lastModified: notesFromDb.find(n => n.id === res.id)?.lastModified as number
                            })
                            addedNoteIds.push(res.id);
                        }
                    })

                    if (searchRes[1]) {
                        searchRes[1].result.forEach((res) => {
                            if (!addedNoteIds.includes(res.id)) {

                                intResArr.push({
                                    id: res.id,
                                    noteName: res.doc.noteName,
                                    matchIn: "content",
                                    topics: notesFromDb.find(n => n.id === res.id)?.topics as string[],
                                    lastModified: notesFromDb.find(n => n.id === res.id)?.lastModified as number,
                                    content: res.doc.content
                                })
                                addedNoteIds.push(res.id);
                            }
                        })
                    }
                    
                    setDisplayedSearchRes([...intResArr]);
                    displayedSearchRes2.current = intResArr;
                } else {
                    let intResArr: DisplaySearchResNote[] = [];

                    searchRes[0].result.forEach((res) => {
                        if (!addedNoteIds.includes(res.id)) {
                            intResArr.push({
                                id: res.id,
                                noteName: res.doc.noteName,
                                matchIn: "content",
                                topics: notesFromDb.find(n => n.id === res.id)?.topics as string[],
                                lastModified: notesFromDb.find(n => n.id === res.id)?.lastModified as number,
                                content: res.doc.content
                            })
                            addedNoteIds.push(res.id);

                        }
                    })
                    setDisplayedSearchRes([...intResArr]);
                }

            } else {
                setDisplayedSearchRes([]);
            }
        }
    }, [searchRes])


    const setSearchResultsInitially = async () => {
        const res = await index.search(storeSearchString, { enrich: true })
        setSearchRes([...res])
    }

    const handleNoteNameClick = (noteId: string, noteName: string) => {
        if (currentWorkspace?.workscreens && currentWorkspace?.workscreens.length < 2) {
            // create new note

            dispatch(createWorkscreen({ inTabId: currentWorkspace.tabId, type: WorkscreenTypes.NOTE, options: { noteId: noteId } }))
        } else {
            // create new note

            dispatch(createNewTab({ tabName: noteName, workscreen: { type: WorkscreenTypes.NOTE, content: { noteId: noteId } } }))
        }
    }

    return (
        <div className="w-2/5 h-fit relative z-50">
            <OutlinedInput
                id="searchbar"
                className="w-full z-10 bg-l-workscreen-bg dark:bg-d-500-divider hover:bg-primary/10"
                color="secondary"
                placeholder="Search"
                ref={inputRef}
                value={storeSearchString}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResultsReady(false);
                    dispatch(inputSearchString(e.target.value));
                    searchStr.current = e.target.value;
                    
                    setSearchResultsInitially();
                }}
                onFocus={() => {
                    if(storeSearchString === "") setDisplayedSearchRes([])
                    setSearchBarFocus(true);
                }}
                onBlur={handleFocusOut}
                sx={[
                    {
                        borderRadius: 1.5,
                        "& .MuiInputBase-input": {
                            py: 0.75,
                            pl: 1,
                        },
                        "& fieldset": {
                            borderWidth: "1px !important",
                            borderColor: "rgba(0,0,0,0) !important",
                        },
                        "& input:focus + fieldset": {
                            borderWidth: "1px !important",
                            borderColor: "rgba(0,0,0,0) !important",
                        },
                    },
                ]}
                startAdornment={<SearchIcon sx={{ opacity: 0.7 }} />}
            />

            <div
                className="w-full h-8 z-0 absolute top-0 rounded-md bg-l-workscreen-bg dark:bg-d-500-divider pt-9 px-4 overflow-hidden"
                id="related-target"
                ref={searchResRef}
                tabIndex={0}
                onBlur={handleFocusOut}
            >
                <div className="overflow-scroll h-full">
                    {/* loop over shit here */}
                    {
                        !resultsReady ? (
                            <div className="w-full h-full">
                                {storeSearchString.length !== 0 ? (
                                    <>
                                        <Divider />
                                        <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Divider />
                                        <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Divider />
                                        <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                                        <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                                    </>
                                ) : null}
                            </div>
                        ) : null
                    }
                    {
                        resultsReady ? (
                            displayedSearchRes.map((match, i) => (
                                <>
                                    <Divider className=" mb-1"  key={`${i}-div`}/>
                                    <div className=" w-full h-fit flex flex-col gap-2 justify-between pb-2 px-2 hover:bg-primary/10" key={i}>

                                        <div className=" w-full flex flex-row justify-between items-center">
                                            <span className=" form-text hover:underline hover:cursor-pointer text-lg" onClick={() => { handleNoteNameClick(match.id as string, match.noteName) }}>
                                                {/* ought be modified if match in name */}
                                                {
                                                    match.noteName.split(' ').map((word, i) => {
                                                        if (word.toLowerCase().includes(storeSearchString.trim().toLowerCase())) {

                                                            return <span key={i} className=" bg-primary">{word} </span>;
                                                        }
                                                        return `${word} `;
                                                    })
                                                }
                                            </span>

                                            <span className="dark:text-l-workspace-bg/70">
                                                {moment.duration(Date.now() - match.lastModified).humanize() + " ago"}
                                            </span>
                                        </div>
                                        <div>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {match.topics && (match.topics as unknown as Topic[]).map((topicId) => {
                                                    const topic = availableTopics.find(t => t.id === topicId as unknown as string) as Topic;
                                                    if (topic) {
                                                        return <Chip key={topic.id} label={topic.topicName} sx={{ backgroundColor: topic.color, height: "23px", color: "black" }} />
                                                    }
                                                })}
                                            </Box>
                                        </div>
                                        {
                                            match.matchIn === "content" ? (
                                                <div className="w-full dark:text-l-workspace-bg/70">
                                                    {
                                                        match.content?.split(" ").map((word, i) => {
                                                            if(match.content?.split(" ")[i+1] && match.content?.split(" ")[i+1].toLowerCase().includes(storeSearchString.trim().toLowerCase())){
                                                                return `...${word} `;
                                                            } else if(word.toLowerCase().includes(storeSearchString.trim().toLowerCase())) {
                                                                // _.difference(word.toLowerCase(), storeSearchString.trim().toLowerCase())
                                                                matchedWordIndex.current = i;
                                                                return <span key={i} className=" bg-primary dark:bg-d-400-sibebar font-semibold">{word}</span>
                                                            } else if (i>matchedWordIndex.current &&  i<= matchedWordIndex.current+5) {
                                                                return i !==  matchedWordIndex.current+5? ` ${word} ` : ` ${word}...`
                                                            } else if(i >  matchedWordIndex.current+5) return;
                                                        })
                                                    }
                                                </div>
                                            ) : null
                                        }

                                    </div>
                                </>
                            ))
                        ) : null
                    }
                </div>
            </div>
        </div>
    );
}

export default Searchbar;