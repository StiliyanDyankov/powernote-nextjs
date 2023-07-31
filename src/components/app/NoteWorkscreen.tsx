"use client"
import dynamic from "next/dynamic";
import Delta from "quill-delta";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/NoteWorkscreen.module.css"
import { RootState } from "@/utils/store";
import { useSelector } from "react-redux";
import Dexie, { Table } from "dexie";
import { notesDb } from "@/utils/notesDb";
import { Tab, Workscreen } from "@/utils/storeSlices/appSlice";

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
		workscreenContext
	}: { 
		setSync: (state: boolean) => void
		workscreenContext: Workscreen
	}) => {

	// const [db, setDb] = useState<Dexie>(()=> {
	// 	// db.version(1).stores({
	// 	// 	notes: 'id, topics, createdAt, lastModified',
	// 	// })

	// 	console.log(db);

	// 	return db;
	// })

    const [value, setValue] = useState<any>(()=> {
		const def = new Delta();
		def.insert("test test");
		return def;
	});

	const value2 = useRef<any>(null)

	const inTimeoutBeforeWrite = useRef<boolean>(false);

	// const [sync, setSync] = useState<boolean>(false)

	const wrapperRef = useRef<HTMLDivElement>(null);

	const theme = useSelector((state: RootState) => state.theme)

	useEffect(()=> {
		console.log(notesDb)
	}, [])

	useEffect(()=> {
		// here we write to indexeddb
		if(!inTimeoutBeforeWrite.current) {
			console.log("before time",value2.current);
			inTimeoutBeforeWrite.current = true;
			setSync(true);
			setTimeout(() => {
				console.log("after time",value2.current);
				inTimeoutBeforeWrite.current = false
				setSync(false)
			}, 3000);

		}

	}, [value])
	

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