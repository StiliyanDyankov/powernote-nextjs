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
						defaultValue={value}
						value={value}
						onChange={(event, delta, source, editor) => {
							setValue(editor.getContents());
							value2.current = editor.getContents();
							updateLastModified();
						}}
						modules={modules}
						style={{
							width: wrapperRef.current?.offsetWidth || "auto"
						}}
					/>
				) : null
			}
		</div>
	);
}

export default NoteWorkscreen;