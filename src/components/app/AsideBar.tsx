"use client"
import { Divider } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useDispatch, useSelector } from "react-redux";
import { WorkscreenTypes, createNewTab, createWorkscreen, openClosingWorkscreenModal } from "@/utils/storeSlices/appSlice";
import { RootState } from "@/utils/store";


const AsideBar = () => {

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));
    const dispatch = useDispatch();

    const handleHomeClick = () => {
        if(currentWorkspace?.workscreens.length === 2) {
            dispatch(openClosingWorkscreenModal());
            return;
        }
        
        if(currentWorkspace) {
            dispatch(createWorkscreen({inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.HOME}))
        } else {
            const initName = "some nofnsadfjdaslfkjasldf";
            
            dispatch(createNewTab(initName))
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

            dispatch(createNewTab(initName))
        }
    }

    const handleNoteClick = () => {
        if(currentWorkspace?.workscreens.length === 2) {
            dispatch(openClosingWorkscreenModal());
            return;
        }

        if(currentWorkspace) {
            dispatch(createWorkscreen({inTabId: currentWorkspace?.tabId, type: WorkscreenTypes.NOTE}))
        } else {
            const initName = "some nofnsadfjdaslfkjasldf";

            dispatch(createNewTab(initName))
        }
    }

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
                    <IconButton color="secondary">
                        <CreateNewFolderIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center none select-none">New Topic</p>
                </div>

            </div>
        </aside>
    );
}
 
export default AsideBar;