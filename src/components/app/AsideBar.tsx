"use client"
import { Divider } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';


const AsideBar = () => {
    return ( 
        <aside className=" flex flex-col justify-start items-center w-20 bg-l-tools-bg border-r border-r-l-divider/50 p-2 dark:bg-d-300-chips">
            <div className=" w-fit flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary">
                        <HomeIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center">Home</p>
                </div>
                
                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary">
                        <PsychologyIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center">Interact</p>
                </div>

                <Divider className="w-full"/>

                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary">
                        <NoteAddIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center">New Note</p>
                </div>

                <div className="flex flex-col gap-0 w-fit h-fit items-center">
                    <IconButton color="secondary">
                        <CreateNewFolderIcon style={{scale: "1.3"}}/>
                    </IconButton>
                    <p className="font-thin leading-4 dark:text-d-700-text text-center">New Topic</p>
                </div>

            </div>
        </aside>
    );
}
 
export default AsideBar;