"use client"
import { Box, Divider, Modal, ThemeProvider, Typography, createTheme } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useDispatch, useSelector } from "react-redux";
import { WorkscreenTypes, createNewTab, createWorkscreen, openClosingWorkscreenModal } from "@/utils/storeSlices/appSlice";
import { RootState } from "@/utils/store";
import { useState } from "react";
import NoteModal from "./NoteModal";
import { colorsTailwind } from "@/utils/themeMUI";
import TopicModal from "./TopicModal";



const AsideBar = () => {

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const mode = useSelector((state: RootState) => state.theme.darkTheme);
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));
    const dispatch = useDispatch();

    const [inNewTab, setInNewTab] = useState<boolean>(false);

    const [openNoteModal, setOpenNoteModal] = useState(false)

    const [openTopicModal, setOpenTopicModal] = useState(false)

    const handleHomeClick = () => {
        if(currentWorkspace?.workscreens.length === 2) {
            dispatch(openClosingWorkscreenModal());
            return;
        }
        
        if(currentWorkspace) {
            dispatch(createWorkscreen({inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.HOME}))
        } else {
            const initName = "some nofnsadfjdaslfkjasldf";
            
            dispatch(createNewTab({ tabName: initName}))
        }
    }

    const handleInteractClick = () => {
        if(currentWorkspace?.workscreens.length === 2) {
            dispatch(openClosingWorkscreenModal());
            return;
        }

        if(currentWorkspace) {
            dispatch(createWorkscreen({inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.INTERACT}))
        } else {
            const initName = "some nofnsadfjdaslfkjasldf";

            dispatch(createNewTab({ tabName: initName}))
        }
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




    const lightTheme = createTheme({
        palette: {
            primary: {
                main: "#90caf9",
            },
            secondary: {
                main: "#003554",
            },
        },
        typography: {
            fontFamily: "Quicksand,Roboto,sans-serif,Segoe UI,Arial",
        },
        components: {
            MuiModal: {
                defaultProps: {
                    container: document.getElementById("_next") || null
                }
            }
        }
    });
    
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: colorsTailwind["d-500-divider"],
            },
            secondary: {
                main: colorsTailwind["d-600-lightest"],
            },
            text: {
                primary: "#bfc3dc"
            }
        },
        typography: {
            fontFamily: "Quicksand, Roboto,sans-serif,Segoe UI,Arial",
        },
        components: {
            MuiModal: {
                defaultProps: {
                    container: document.getElementById("_next") || null
                }
            }
        }
    });




    return ( 
        <aside className=" flex flex-col justify-start items-center w-20 bg-l-tools-bg border-r border-r-l-divider/50 p-2 dark:bg-d-300-chips">
            <div className=" w-fit flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary" onClick={handleHomeClick}>
                        <HomeIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center none select-none">Home</p>
                </div>
                
                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary" onClick={handleInteractClick}>
                        <PsychologyIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center none select-none">Interact</p>
                </div>

                <Divider className="w-full"/>

                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary" onClick={handleNoteClick}>
                        <NoteAddIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center none select-none">New Note</p>
                </div>

                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary" onClick={handleTopicClick}>
                        <CreateNewFolderIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center none select-none">New Topic</p>
                </div>

            </div>

            <ThemeProvider theme={mode ? darkTheme : lightTheme}>

                <NoteModal open={openNoteModal} setOpen={setOpenNoteModal} currentWorkspace={currentWorkspace} createInNewTab={inNewTab}/>
                <TopicModal open={openTopicModal} setOpen={setOpenTopicModal} />
            </ThemeProvider>
        </aside>
    );
}

// <div className=" w-fit h-fit bg-l-tools-bg/30  dark:bg-d-300-chips/50 border border-l-divider/50 rounded-lg flex flex-col p-4">
//                 <div className="font-medium text-xl mb-4 dark:text-l-workscreen-bg">
//                     some text
//                 </div>

//             </div>
 
export default AsideBar;