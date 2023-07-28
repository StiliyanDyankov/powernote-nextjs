"use client"
import dynamic from "next/dynamic";
import Delta from "quill-delta";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "../../styles/NoteWorkscreen.module.css"
import { RootState } from "@/utils/store";
import { useSelector } from "react-redux";

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

const NoteWorkscreen = () => {
    const [value, setValue] = useState<any>(()=> {
		const def = new Delta();
		def.insert("test test");
		return def;
	});

	const theme = useSelector((state: RootState) => state.theme)

	
    return (
        <div 
            // className="w-full h-full bg-primary rounded-b-lg"
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
							console.log(event)
							console.log(delta)
							console.log(source)
							console.log(editor)
						}}
						// className=" w-96 h-96"
						modules={modules}
					/>
				): null
			}
        </div>
    );
}
 
export default NoteWorkscreen;