import { RootState } from "@/utils/store";
import { Workscreen } from "@/utils/storeSlices/appSlice";
import { useDispatch, useSelector } from "react-redux";

const WorkscreenView = () => {
    const dispatch = useDispatch();

    const chain = useSelector((state: RootState) => state.app.tabActivityChain)
    const currentActiveTab = chain[chain.length - 1];
    const currentWorkscreen = useSelector((state: RootState) => state.app.tabs.find(t => t.tabId === currentActiveTab));

    return ( 
        <div className=" bg-l-workscreen-bg dark:bg-d-100-body-bg">
            {currentWorkscreen?.tabId}
        </div>
    );
}
 
export default WorkscreenView;