import { RootState } from "@/utils/store";
import { IconButton, Tab, Tabs } from "@mui/material";
import { useSelector } from "react-redux";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';


const TabBar = () => {
    const tabs = useSelector((state: RootState) => state.app.tabs);
    const activeTab = useSelector((state: RootState) => state.app.activeTab);


    return ( 
        <>
            {/* tab bar */}
            <div className="w-full h-9 bg-l-tools-bg border-b border-b-l-divider/50 dark:bg-d-300-chips pl-4 flex flex-row items-end justify-start">
                {/* tab container */}
                <div className=" w-fit h-7 flex flex-row gap-2 items-end justify-start">
                    {/* tabs */}
                    {
                        tabs.map((tab, i) => (
                            <div key={i} className={`w-48 h-7 ${tab.tabId === activeTab ? "bg-primary" : "bg-primary/50"} rounded-t-md flex flex-row items-center justify-between pl-2 font-thin text-sm`}>
                                <p>{tab.tabName}</p>
                                <IconButton color="secondary" sx={{ width: "1.5rem", height: "1.5rem"}}>
                                    <CloseRoundedIcon style={{scale: "0.8"}}/>
                                </IconButton>
                            </div>        
                        ))
                    }
                    <div className=" w-48 h-7 bg-primary rounded-t-md flex flex-row items-center justify-between pl-2 font-thin text-sm">
                        <p>Some tab</p>
                        <IconButton color="secondary" sx={{ width: "1.5rem", height: "1.5rem"}}>
                            <CloseRoundedIcon style={{scale: "0.8"}}/>
                        </IconButton>
                    </div>
                    <div className=" w-48 h-7 bg-primary rounded-t-md">

                    </div>
                    <div className=" w-48 h-7 bg-primary rounded-t-md">

                    </div>
                    <IconButton color="secondary" sx={{ width: "1.5rem", height: "1.5rem", p: 0}} className=" self-center">
                        <AddRoundedIcon />
                    </IconButton>
                </div>
            </div>
        </>
    );
}
 
export default TabBar;