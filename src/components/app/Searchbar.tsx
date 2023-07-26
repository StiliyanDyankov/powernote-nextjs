"use client"

import {Divider, OutlinedInput, Skeleton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useRef, useState } from "react";
import React from "react";
import { gsap } from "gsap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { clearSearchString, inputSearchString } from "@/utils/storeSlices/appSlice";




const Searchbar = () => {
    const [displaySearchResults, setDisplaySearchResults] = useState<boolean>(false)

    const dispatch = useDispatch();
    const storeSearchString = useSelector((state: RootState) => state.app.searchString)

    const inputRef = useRef(null);

    const searchResRef = useRef(null);
    
    useEffect(()=> {
        // could be removed idk
        dispatch(clearSearchString());
    }, [])

    useEffect(()=> {
        if(displaySearchResults) {
            gsap.fromTo(searchResRef.current, {height: 35, boxShadow:"0px 0px 20px 0px rgba(0,0,0,0)"}, { height: 300, boxShadow:"0px 0px 20px 0px rgba(0,0,0,0.4)", duration: 0.5})
        } else {
            gsap.to(searchResRef.current, {height: 35, boxShadow:"0px 0px 20px 0px rgba(0,0,0,0)", duration: 0.5})
        }
    }, [displaySearchResults])

    // some abomination
    function handleFocusOut(event: any) {
        console.log(event);
        if (event.relatedTarget 
            && (event.relatedTarget.id === "searchbar"
            || event.relatedTarget as HTMLElement === searchResRef.current
            || (searchResRef.current as unknown as HTMLElement).contains((event.relatedTarget as HTMLElement)))) {
            return;
        } else {
            setDisplaySearchResults(false);
        }
    }
    
    return (
        <div className="w-2/5 h-fit relative z-50">
            <OutlinedInput
                id="searchbar"
                className="w-full z-10 bg-l-workscreen-bg dark:bg-d-500-divider"
                color="secondary"
                placeholder="Search"
                ref={inputRef}
                value={storeSearchString}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=> {
                    dispatch(inputSearchString(e.target.value));
                }}
                onFocus={()=> {
                    setDisplaySearchResults(true)
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
                startAdornment={ <SearchIcon sx={{ opacity: 0.7 }}/> }
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
                    <Divider/>
                    <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                    <Divider/>
                    <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                    <Divider/>
                    <Skeleton className=" w-11/12" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-1/2" variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton className=" w-10/12" variant="text" sx={{ fontSize: '1rem' }} />
                </div>
            </div>
        </div>
    );
}
 
export default Searchbar;