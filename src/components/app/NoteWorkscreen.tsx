"use client"
import dynamic from "next/dynamic";
import Delta from "quill-delta";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/NoteWorkscreen.module.css"
import { RootState } from "@/utils/store";
import { useSelector } from "react-redux";
import Dexie, { Table } from "dexie";
import { Note, notesDb } from "@/utils/notesDb";
import { NoteContent, Tab, Workscreen } from "@/utils/storeSlices/appSlice";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      ["link", "image", "video"],
      ["clean"]
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
};


const NoteWorkscreen = ({ 
		setSync,
		workscreenContext,
		currentNote
	}: { 
		setSync: (state: boolean) => void
		workscreenContext: Workscreen,
		currentNote: Note | null
	}) => {

    const [value, setValue] = useState<any>(null);


	const value2 = useRef<any>(null)

	const inTimeoutBeforeWrite = useRef<boolean>(false);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const theme = useSelector((state: RootState) => state.theme)

	useEffect(()=> {
		console.log("Current note", currentNote)
		if(currentNote && value === null) {
			setValue(currentNote.content);
		}
		// console.log("db", notesDb)
		// console.log((workscreenContext.content as NoteContent).noteId);
	}, [currentNote])

	useEffect(()=> {
		// here we write to indexeddb
		if(value !== null) {

			if(value2.current === null) {
				value2.current = value
			}
			if(!inTimeoutBeforeWrite.current && currentNote) {
				console.log("before time",value2.current);
				
				inTimeoutBeforeWrite.current = true;
				setSync(true);

				setTimeout(() => {
					console.log("after time",value2.current);
					writeContents();
				}, 3000);
			}
		}
	}, [value])

	const writeContents = async () => {
		console.log("runs write", currentNote)
		if(currentNote && currentNote.id) {
			try {
				const op = await notesDb.notes.update(currentNote?.id, {
					content: value2.current
				})
				console.log("runs writing to db with op value", op);
				if(op) {
					setSync(false)
					inTimeoutBeforeWrite.current = false
				}
			} catch (e) {
				console.error(e)
			}

		}

	}
	

    return (
        <div 
			id="text-editor-wrapper"
            className="w-full h-full rounded-b-lg"
			ref={wrapperRef}
        >
			{
				document !== undefined ? (
					<ReactQuill
						theme="snow"
						className={theme.darkTheme ? "dark": ""}
						defaultValue={value}
						value={value} 
						onChange={(event, delta, source, editor) => {
							console.log("runs on write handler", editor.getContents())
							setValue(editor.getContents())
							value2.current = editor.getContents()
						}}
						modules={modules}
						style={{
							width: wrapperRef.current?.offsetWidth || "auto"
						}}
					/>
				): null
			}
        </div>
    );
}
 
export default NoteWorkscreen;