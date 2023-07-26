"use client"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

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
    position: PossiblePositions;
    type: WorkscreenTypes;
    content: InteractContent | HomeContent | NoteContent;
}

enum WorkscreenTypes {
    NOTE = "NOTE",
    INTERACT = "INTERACT",
    HOME = "HOME",
}

enum PossiblePositions {
    FULL = "FULL",
    LEFT = "LEFT", 
    RIGHT = "RIGHT",
    TOP = "TOP",
    BOTTOM = "BOTTOM",
    TOP_LEFT = "TOP_LEFT",
    TOP_RIGHT = "TOP_RIGHT",
    BOTTOM_LEFT = "BOTTOM_LEFT", 
    BOTTOM_RIGHT = "BOTTOM_RIGHT"
}

interface InteractContent {
    messages: Message[];
}

interface Message {

}

interface HomeContent {
    topics: Topic[];
    notes: SearchResult[];
}

interface NoteContent {
    noteId: number;
    innerText: string; // could be delta obj
}

export interface AppState {
    counterForTabs: number,
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
        createNewTab: (state, action: PayloadAction<string>) => {
            state.tabs.push({
                tabId: state.counterForTabs,
                tabName: action.payload,
                workscreens: [{
                    position: PossiblePositions.FULL,
                    type: WorkscreenTypes.HOME,
                    content: {
                        topics: [],
                        notes: []
                    }
                }]
            })
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

            console.log(action.payload)
            console.log(newArray)
            state.tabs = newArray;
            // return newArray;
        },
        clearTabs: (state) => {
            state.tabs = [];
            state.tabActivityChain = [];
        },
    },
});

export const { inputSearchString, clearSearchString, createNewTab, removeTab, setActiveTab, clearTabs, rearangeTabs } = appSlice.actions;

const persistedReducer = persistReducer(persistConfig, appSlice.reducer);
export default persistedReducer;