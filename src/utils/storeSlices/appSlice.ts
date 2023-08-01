"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { validateEmail } from "@/components/authPortal/EmailField";
import { generateId } from "@/components/app/WorkspaceView";
import _ from 'lodash';
import { DragEndEvent } from "@dnd-kit/core";
import Delta from "quill-delta";

interface Topic {
    topicId: number;
    name: string;
    color: string;
}

interface SearchResult {
    noteName: string;
    lastOpened: number;
    topics: Topic[];
    content: string;
}

export interface Tab {
    tabId: number;
	tabName: string;
	workscreens: Workscreen[];
}

export interface Workscreen {
    id: string;
    position: PossiblePositions;
    type: WorkscreenTypes;
    content: InteractContent | HomeContent | NoteContent;
}

export enum WorkscreenTypes {
    NOTE = "NOTE",
    INTERACT = "INTERACT",
    HOME = "HOME",
}

export enum PossiblePositions {
    FULL = "col-start-1 col-end-3 row-start-1 row-end-3",
    LEFT = "col-start-1 col-end-2 row-start-1 row-end-3", 
    RIGHT = "col-start-2 col-end-3 row-start-1 row-end-3",
    TOP = "col-start-1 col-end-3 row-start-1 row-end-2",
    BOTTOM = "col-start-1 col-end-3 row-start-2 row-end-3",
    TOP_LEFT = "col-start-1 col-end-2 row-start-1 row-end-2",
    TOP_RIGHT = "col-start-2 col-end-3 row-start-1 row-end-2",
    BOTTOM_LEFT = "col-start-1 col-end-2 row-start-2 row-end-3", 
    BOTTOM_RIGHT = "col-start-2 col-end-3 row-start-2 row-end-3"
}

export interface InteractContent {
    messages: Message[];
}

interface Message {

}

export interface HomeContent {
    topics: Topic[];
    notes: SearchResult[];
}

export interface NoteContent {
    noteId: string;
    // noteName: string;

    // createdAt: number;
    // lastModified: number;

    // noteContent: Delta; // could be delta obj
}

export interface AppState {
    closeWorkscreenModal: boolean;
    topicCreationSuccessfulModal: boolean;
    counterForTabs: number;
    searchString: string;
    searchResults: SearchResult[];
    tabs: Tab[];
    tabActivityChain: number[];
}

export const persistConfig: PersistConfig<AppState> = {
    key: "app",
    storage,
};


const initialState: AppState = {
    closeWorkscreenModal: false,
    topicCreationSuccessfulModal: true,
    counterForTabs: 0,
    searchString: "",
    searchResults: [],
    tabs: [],
    tabActivityChain: []
};

const cleanChain = (chain: number[]) => {
    if(chain.length > 100) {
        return chain.slice(-100);
    } else return chain;
}

const getCorresponingQuadrants = (position: PossiblePositions): number[] => {
    switch (position) {
        case PossiblePositions.FULL:
            return [1, 2, 3, 4];
        case PossiblePositions.LEFT:
            return [3, 4];
        case PossiblePositions.RIGHT:
            return [1, 2];
        case PossiblePositions.TOP:
            return [1, 4];
        case PossiblePositions.BOTTOM:
            return [2, 3];
        case PossiblePositions.TOP_RIGHT:
            return [1];
        case PossiblePositions.BOTTOM_RIGHT:
            return [2];
        case PossiblePositions.BOTTOM_LEFT:
            return [3];
        case PossiblePositions.TOP_LEFT:
            return [4];
    }
}

const getCorresponingPosition = (position: number[]): PossiblePositions => {
    switch (position.toString()) {
        case [1, 2, 3, 4].toString():
            return PossiblePositions.FULL;
        case [3, 4].toString():
            return PossiblePositions.LEFT;
        case [1, 2].toString():
            return PossiblePositions.RIGHT;
        case [1, 4].toString():
            return PossiblePositions.TOP;
        case [2, 3].toString():
            return PossiblePositions.BOTTOM;
        case [1].toString():
            return PossiblePositions.TOP_RIGHT;
        case [2].toString():
            return PossiblePositions.BOTTOM_RIGHT;
        case [3].toString():
            return PossiblePositions.BOTTOM_LEFT;
        case [4].toString():
            return PossiblePositions.TOP_LEFT;
        default:
            return PossiblePositions.FULL;
    }
}



// returns the position for the new element 
const resolveGridConflicts = (workscreens: Workscreen[], requestedPosition: PossiblePositions): 
    { modifiedScreens: Workscreen[], placeHere: PossiblePositions } | undefined => {
    
    let quadrants = [1,2,3,4];

    // first check for available space
    workscreens.forEach((ws) => {
        quadrants = _.difference(quadrants, getCorresponingQuadrants(ws.position))
    })

    if(quadrants.length === 3) {
        if(_.isEqual(quadrants, [1,2,3])) {
            quadrants = quadrants.filter(v => v !== 3);
        }
        if(_.isEqual(quadrants, [1,2,4])) {
            quadrants = quadrants.filter(v => v !== 4);
        }
        if(_.isEqual(quadrants, [2,3,4])) {
            quadrants = quadrants.filter(v => v !== 2);
        }
        if(_.isEqual(quadrants, [1,3,4])) {
            quadrants = quadrants.filter(v => v !== 1);
        }
    }
    
    if(quadrants.length > 0) {
        console.log("corresponding position",getCorresponingPosition(quadrants))
        return {
            modifiedScreens: workscreens,
            placeHere: getCorresponingPosition(quadrants)
        }
    }

    // if there is available space, asign it 

    // collision resolution -> here we know that there is no available space
    if(workscreens.length === 1) {
        workscreens[0].position = PossiblePositions.LEFT
        return {
            modifiedScreens: workscreens,
            placeHere: PossiblePositions.RIGHT
        }
    } 
    if(workscreens.length === 2) {
        const rightScreen = workscreens.find(ws => ws.position === PossiblePositions.RIGHT)
        if(rightScreen) {
            rightScreen!.position = PossiblePositions.TOP_RIGHT;
            return {
                modifiedScreens: workscreens,
                placeHere: PossiblePositions.BOTTOM_RIGHT
            }
        } else {
            const bottomScreen = workscreens.find(ws => ws.position === PossiblePositions.BOTTOM);
            bottomScreen!.position = PossiblePositions.BOTTOM_LEFT;
            return {
                modifiedScreens: workscreens,
                placeHere: PossiblePositions.BOTTOM_RIGHT
            }
        }
    }
    if(workscreens.length === 3) {
        const longScreen = workscreens.find(ws => [PossiblePositions.BOTTOM, PossiblePositions.LEFT, PossiblePositions.RIGHT, PossiblePositions.TOP].includes(ws.position))
        switch (longScreen?.position) {
            case PossiblePositions.TOP:
                longScreen.position = PossiblePositions.TOP_LEFT
                return {
                    modifiedScreens: workscreens,
                    placeHere: PossiblePositions.TOP_RIGHT
                }
            case PossiblePositions.BOTTOM:
                longScreen.position = PossiblePositions.BOTTOM_LEFT
                return {
                    modifiedScreens: workscreens,
                    placeHere: PossiblePositions.BOTTOM_RIGHT
                }
            case PossiblePositions.RIGHT:
                longScreen.position = PossiblePositions.TOP_RIGHT
                return {
                    modifiedScreens: workscreens,
                    placeHere: PossiblePositions.BOTTOM_RIGHT
                }
            case PossiblePositions.LEFT:
                longScreen.position = PossiblePositions.TOP_LEFT
                return {
                    modifiedScreens: workscreens,
                    placeHere: PossiblePositions.BOTTOM_LEFT
                }
        }
    } 
}

const takeAvailableSpace = (workscreens: Workscreen[]): Workscreen[] | undefined => {
    if(workscreens.length === 0) {
        return workscreens;
    }
    if(workscreens.length === 1) {
        workscreens[0].position = PossiblePositions.FULL;
        return workscreens;
    }
    if(workscreens.length === 2) {
        const shortScreens = workscreens.filter(ws => [PossiblePositions.BOTTOM_LEFT, PossiblePositions.BOTTOM_RIGHT, PossiblePositions.TOP_RIGHT, PossiblePositions.TOP_LEFT].includes(ws.position))
        
        
        let quadrants = [1,2,3,4];
        
        // first check for available space
        workscreens.forEach((ws) => {
            quadrants = _.difference(quadrants, getCorresponingQuadrants(ws.position))
        })

        if(shortScreens.length === 0) {
            return workscreens;
        }

        if(shortScreens.length === 1) {
            
            const freespace = getCorresponingPosition(quadrants); 
            let verticalAlign = false;
            if(shortScreens[0].position.split(" ")[0] === freespace.split(" ")[0]) {
                // spaces are vertically aligned
                verticalAlign = true;
            } else {
                // spaces are horizontally aligned
            }
            console.log("get's here", verticalAlign)
            
            if(verticalAlign){    
                switch (freespace) {
                    case PossiblePositions.TOP_LEFT:
                        shortScreens[0].position = PossiblePositions.LEFT; return workscreens;
                    case PossiblePositions.BOTTOM_LEFT:
                        shortScreens[0].position = PossiblePositions.RIGHT; return workscreens;
                    case PossiblePositions.TOP_RIGHT:
                        shortScreens[0].position = PossiblePositions.LEFT; return workscreens;
                    case PossiblePositions.BOTTOM_RIGHT:
                        shortScreens[0].position = PossiblePositions.RIGHT; return workscreens;
                }
            } else {
                switch (freespace) {
                    case PossiblePositions.TOP_LEFT:
                        shortScreens[0].position = PossiblePositions.TOP; return workscreens;
                    case PossiblePositions.BOTTOM_LEFT:
                        shortScreens[0].position = PossiblePositions.BOTTOM; return workscreens;
                    case PossiblePositions.TOP_RIGHT:
                        shortScreens[0].position = PossiblePositions.TOP; return workscreens;
                    case PossiblePositions.BOTTOM_RIGHT:
                        shortScreens[0].position = PossiblePositions.BOTTOM; return workscreens;
                }
            }
        }

        // if(shortScreens.length === 2)

        // switch (longScreen?.position) {
        //     case PossiblePositions.TOP:
        //         longScreen.position = PossiblePositions.TOP_LEFT
        //     case PossiblePositions.BOTTOM:
        //         longScreen.position = PossiblePositions.BOTTOM_LEFT
        //     case PossiblePositions.RIGHT:
        //         longScreen.position = PossiblePositions.TOP_RIGHT
        //     case PossiblePositions.LEFT:
        //         longScreen.position = PossiblePositions.TOP_LEFT
        // }
    }
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        inputSearchString: (state, action: PayloadAction<string>) => {
            state.searchString = action.payload;
        },
        clearSearchString: (state) => {
            state.searchString = "";
        },
        createNewTab: (state, action: PayloadAction<{tabName: string, workscreen?: { type: WorkscreenTypes, content: HomeContent | NoteContent | InteractContent }}>) => {
            if(action.payload.workscreen) {
                state.tabs.push({
                    tabId: state.counterForTabs,
                    tabName: action.payload.tabName,
                    workscreens: [{
                        id: generateId(),
                        position: PossiblePositions.FULL,
                        type: action.payload.workscreen.type,
                        content: action.payload.workscreen.content
                    }]
                })
            } else {
                state.tabs.push({
                    tabId: state.counterForTabs,
                    tabName: action.payload.tabName,
                    workscreens: [{
                        id: generateId(),
                        position: PossiblePositions.FULL,
                        type: WorkscreenTypes.HOME,
                        content: {
                            topics: [],
                            notes: []
                        }
                    }]
                })
            }
            
            state.tabActivityChain.push(state.counterForTabs);
            state.tabActivityChain = cleanChain(state.tabActivityChain);

            state.counterForTabs++;
        },
        removeTab: (state, action: PayloadAction<number>) => {
            state.tabs = state.tabs.filter(t => t.tabId !== action.payload);
            
            // clean up activity chain of references to removed tab
            state.tabActivityChain = state.tabActivityChain.filter(t => t !== action.payload);
            state.tabActivityChain = cleanChain(state.tabActivityChain);
        },
        setActiveTab: (state, action: PayloadAction<number>) => {
            state.tabActivityChain.push(action.payload);
            state.tabActivityChain = cleanChain(state.tabActivityChain);
        },
        rearangeTabs: (state, action: PayloadAction<{delta: number, placement: number, tobeMoved: number}>) => {
            const array = [...state.tabs];
            const index = array.findIndex((element) => element.tabId === action.payload.tobeMoved);
            const placementIndex = array.findIndex((element) => element.tabId === action.payload.placement);

            if (index === -1 || placementIndex === -1) {
                state.tabs = array;
                // return array;
            }

            const newArray = [...array];
            const [removed] = newArray.splice(index, 1);
            const newIndex = placementIndex + (action.payload.delta > 0 ? 0 : 0);
            newArray.splice(newIndex, 0, removed);

            state.tabs = newArray;
            // return newArray;
        },
        clearTabs: (state) => {
            state.tabs = [];
            state.tabActivityChain = [];
        },
        openClosingWorkscreenModal: (state) => {
            state.closeWorkscreenModal = true;
        },
        closeClosingWorkscreenModal: (state) => {
            state.closeWorkscreenModal = false;
        },
        openTopicCreationSuccessfulModal: (state) => {
            state.topicCreationSuccessfulModal = true;
        },
        closeTopicCreationSuccessfulModal: (state) => {
            state.topicCreationSuccessfulModal = false;
        },
        closeWorkscreen: (state, action: PayloadAction<{inTabId: number, workscreenId: string}>) => {
            const targetTab = state.tabs.find(t => t.tabId === action.payload.inTabId);

            targetTab!.workscreens = targetTab?.workscreens.filter(ws => ws.id !== action.payload.workscreenId) as Workscreen[];

            // console.log(takeAvailableSpace(targetTab!.workscreens));
            if(targetTab?.workscreens !== undefined &&  targetTab!.workscreens.length > 0) {
                targetTab!.workscreens = takeAvailableSpace(targetTab!.workscreens) as Workscreen[];
            }
        },
        createWorkscreen: (state, action: PayloadAction<{inTabId: number, type: WorkscreenTypes, options?: Object}>) => {
            const targetTab = state.tabs.find(t => t.tabId === action.payload.inTabId);

            console.log(targetTab);

            if(targetTab && targetTab.workscreens) {   
                const { modifiedScreens, placeHere } = resolveGridConflicts(targetTab.workscreens, PossiblePositions.BOTTOM)!;
                
                targetTab.workscreens = modifiedScreens;
                if(action.payload.type === WorkscreenTypes.HOME) {
                    targetTab?.workscreens.push({
                        id: generateId(),
                        position: placeHere,
                        type: WorkscreenTypes.HOME,
                        content: {
                            topics: [],
                            notes: []
                        }
                    })
                }
                if(action.payload.type === WorkscreenTypes.INTERACT) {
                    targetTab?.workscreens.push({
                        id: generateId(),
                        position: placeHere,
                        type: WorkscreenTypes.INTERACT,
                        content: {
                            messages: []
                        }
                    })
                }
                if(action.payload.type === WorkscreenTypes.NOTE) {
                    if(action.payload.options && (action.payload.options as NoteContent).noteId) {

                        targetTab?.workscreens.push({
                            id: generateId(),
                            position: placeHere,
                            type: WorkscreenTypes.NOTE,
                            content: {
                                noteId: (action.payload.options as NoteContent).noteId,
                            }
                        });
                    }
                }
            }
        },
        rearangeWorkscreens: (state, action: PayloadAction<{dragEndEvent: DragEndEvent, inTabId: number}>) => {
            const targetTab = state.tabs.find(t => t.tabId === action.payload.inTabId);

            if(action.payload.dragEndEvent.over !== null) {

                let draggedWs = targetTab?.workscreens.find(ws => ws.id === action.payload.dragEndEvent.active.id);
                let overWS = targetTab?.workscreens.find(ws => ws.id === action.payload.dragEndEvent.over?.id);
                
                if(targetTab?.workscreens.length === 1) {
                    draggedWs!.position = overWS?.position as PossiblePositions;
                } else if(targetTab?.workscreens.length === 2) {
                    // if workscreens are two

                    const cont = overWS?.position as PossiblePositions;
                    overWS!.position = draggedWs?.position as PossiblePositions;
                    draggedWs!.position = cont;
                }
                console.log(action.payload);
            }
        }
    },
});

export const { 
    inputSearchString, 
    clearSearchString, 
    createNewTab, 
    removeTab, 
    setActiveTab, 
    clearTabs, 
    rearangeTabs, 
    closeWorkscreen, 
    createWorkscreen, 
    openClosingWorkscreenModal, 
    closeClosingWorkscreenModal,
    rearangeWorkscreens,
    openTopicCreationSuccessfulModal,
    closeTopicCreationSuccessfulModal,
} = appSlice.actions;

const persistedReducer = persistReducer(persistConfig, appSlice.reducer);
export default persistedReducer;