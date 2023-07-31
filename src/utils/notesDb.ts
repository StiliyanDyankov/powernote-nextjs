import Dexie, { Table } from "dexie";
import Delta from "quill-delta";

export interface Note {
    id?: string;
    noteName: string;
    topics: string[];
    description: string;
    createdAt: number;
	lastModified: number;
	content: Delta;
}

export class NotesDexie extends Dexie {
// 'friends' is added by dexie when declaring the stores()
// We just tell the typing system this is the case
    notes!: Table<Note>; 

    constructor() {
        super('krisinote');
        this.version(2).stores({
			notes: 'id, noteName, topics, description, createdAt, lastModified', // Primary key and indexed props
        });
    }
}

export const notesDb = new NotesDexie();