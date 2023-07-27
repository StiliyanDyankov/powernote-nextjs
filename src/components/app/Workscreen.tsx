import { RootState } from "@/utils/store";
import { Workscreen } from "@/utils/storeSlices/appSlice";
import { useDispatch, useSelector } from "react-redux";

const WorkscreenView = () => {
    const dispatch = useDispatch();

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    // const currentActiveTab = chain[chain.length - 1];
    const currentWorkspace = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === chain[chain.length - 1]));

    return ( 
        <div className=" bg-l-workscreen-bg dark:bg-d-100-body-bg grid grid-cols-2 grid-rows-2">
            <div className=" bg-primary w-full h-full"></div>
        </div>
    );
}
 
export default WorkscreenView;