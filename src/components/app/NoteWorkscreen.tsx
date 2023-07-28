import { useState } from "react";
import ReactQuill from "react-quill";


const NoteWorkscreen = () => {
    const [value, setValue] = useState('test test test');
    return (
        <div className="w-full h-full bg-primary rounded-b-lg">
            <ReactQuill 
                theme="snow" 
                value={value} 
                onChange={setValue}
                className=" w-96 h-96"
                modules={{
                    toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{size: []}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, 
                        {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    clipboard: {
                        // toggle to add extra line breaks when pasting HTML:
                        matchVisual: false,
                    }
                }}
            />
        </div>
    );
}
 
export default NoteWorkscreen;