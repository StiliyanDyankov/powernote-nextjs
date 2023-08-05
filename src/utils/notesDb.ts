"use client"
import Dexie, { Table } from "dexie";
import Delta from "quill-delta";
import { NoteTypes } from "./storeSlices/appSlice";

export interface Note {
    id?: string;
    noteName: string;
    topics: string[];
    description: string;
    createdAt: number;
    lastModified: number;
    type?: NoteTypes;
    content: Delta | string;
    from?: string;
}

export interface Topic {
    id: string;
    topicName: string;
    description: string;
    createdAt: number;
    lastModified: number;
    color: string;
}

export class NotesDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    notes!: Table<Note>;
    topics!: Table<Topic>;

    constructor() {
        super('krisinote');
        this.version(2).stores({
            notes: 'id, noteName, topics, description, createdAt, lastModified', // Primary key and indexed props
            topics: 'id, topicName, description, createdAt, lastModified, color'
        });
    }
}

export const notesDb = new NotesDexie();