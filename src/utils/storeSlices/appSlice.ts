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

interface Tab {
    tabId: number;
	tabName: string;
	workscreens: Workscreen[];
}

interface Workscreen {
    position: string;
    type: WorkscreenTypes;
    content: InteractContent | HomeContent | NoteContent;
}

enum WorkscreenTypes {
    NOTE = "NOTE",
    INTERACT = "INTERACT",
    HOME = "HOME",
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
    searchString: string;
    searchResults: SearchResult[];
    tabs: Tab[];
    activeTab: number | null;
}

export const persistConfig: PersistConfig<AppState> = {
    key: "app",
    storage,
};


const initialState: AppState = {
    searchString: "",
    searchResults: [],
    tabs: [],
    activeTab: null
};

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
    },
});

export const { inputSearchString, clearSearchString } = appSlice.actions;

const persistedReducer = persistReducer(persistConfig, appSlice.reducer);
export default persistedReducer;