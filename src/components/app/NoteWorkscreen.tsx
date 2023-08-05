"use client"
import dynamic from "next/dynamic";
import Delta from "quill-delta";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/NoteWorkscreen.module.css"
import { RootState } from "@/utils/store";
import { useDispatch, useSelector } from "react-redux";
import Dexie, { Table } from "dexie";
import { Note, notesDb } from "@/utils/notesDb";
import { NoteContent, NoteUnsyncOperations, Tab, Workscreen, setFlexsearchSyncState } from "@/utils/storeSlices/appSlice";
import { index } from "@/pages/app";

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

	const dispatch = useDispatch();

	const [value, setValue] = useState<any>(null);

    const syncState = useSelector((state: RootState) => state.app.flexsearchSync)

	const value2 = useRef<any>(null)

	const inTimeoutBeforeWrite = useRef<boolean>(false);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const theme = useSelector((state: RootState) => state.theme)

	const [embedDone, setEmbedDone] = useState<boolean>(false)

	useEffect(() => {
		// here we write to indexeddb
		if (value !== null) {
			if (value2.current === null) {
				value2.current = value
			}

			if (!inTimeoutBeforeWrite.current && currentNote) {

				inTimeoutBeforeWrite.current = true;
				setSync(true);

				setTimeout(() => {
					writeContents();
				}, 3000);
			}
		}
	}, [value])

	useEffect(() => {
		if (currentNote && value === null) {
			setValue(currentNote.content);
		}
	}, [currentNote])

	// useEffect(()=> {
	// 	var htmlToInsert = "<p>here is some <strong>awesome</strong> text</p>"
	// 	var editor = document.getElementsByClassName('ql-editor');
	// 	var editor2 = document.querySelector('.ql-editor');
	// 	var editor3 = document.getElementById("quill-editor");

	// 	console.log(editor.namedItem("div.ql-editor"))
	// 	console.log("QUILLLLLLLLLLLLL",editor3)
	// 	if(editor3 && !embedDone) {
	// 		const textEditor = editor3.lastChild?.firstChild as HTMLElement;
	// 		const toBeInjected = document.createElement("div");
	// 		// toBeInjected.innerHTML = htmlToInsert;
			
	// 		textEditor?.appendChild(toBeInjected);
	// 		setEmbedDone(true);

			
	// 	}
	// 	// editor[0].innerHTML = htmlToInsert
	// },[value])


	const writeContents = async () => {
		console.log("runs write", currentNote)
		if (currentNote && currentNote.id) {
			try {
				const op = await notesDb.notes.update(currentNote?.id, {
					content: value2.current
				})
				if (op) {
					setSync(false)
					inTimeoutBeforeWrite.current = false
					dispatch(setFlexsearchSyncState({
						syncState: false,
						details: {
							operation: NoteUnsyncOperations.CREATE,
							inNoteId: currentNote.id
						}
					}));
					const note = await notesDb.notes.get(currentNote.id);
					if(note) {
						index.update({
							id: note.id,
							noteName: note.noteName, 
							content: (note.content as Delta).ops[0] ? 
								(note.content as Delta).ops[0].insert : "" 		
						})
					}
				}
			} catch (e) {
				console.error(e)
			}
		}
	}

	useEffect(() => {
		return () => {
			// write to db upon closing

			writeContents();
		}
	}, [])

	const updateLastModified = async () => {
		if (currentNote && currentNote.id) {
			try {
				const op = await notesDb.notes.update(currentNote?.id, {
					lastModified: Date.now()
				})
				if (op) {
					setSync(true)
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
						className={theme.darkTheme ? "dark" : ""}
						id={"quill-editor"}
						defaultValue={value}
						value={value}
						onChange={(event, delta, source, editor) => {
							setValue(editor.getContents());
							value2.current = editor.getContents();
							
							updateLastModified();
						}}
						modules={modules}
						style={{
							width: "100%"
						}}
					/>
				) : null
			}
		</div>
	);
}

export default NoteWorkscreen;