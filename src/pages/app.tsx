"use client"

import { useEffect, useRef, useState } from "react";
import InitialLoader from "@/components/app/InitialLoader";
import gsap from "gsap";
import AppView from "@/components/app/AppView";
import { notesDb } from "@/utils/notesDb";
import Delta from "quill-delta";
import { generateId } from "@/components/app/WorkspaceView";
// import { Document as TDocument } from "flexsearch";
let { Document } = require(`flexsearch`);


export const index = new Document({
	id: "id",
	tokenize: "forward",
	index: ["noteName", "content"],
	store: true
  });
  
  

const AppPage = () => {

	const loaderRef = useRef(null)

    const [isLoading, setIsLoading] = useState<boolean>(true);

	const [startFakeLoad, setStartFakeLoad] = useState<boolean>(false);
	

	const loadDataFromStore = async () => {
		const time = Date.now();
		const notes = await notesDb.notes.toArray()
		if(notes.length> 0){

			notes.forEach((note)=> {
				index.add({id:note.id, noteName: note.noteName, content: note.content.ops[0] ? note.content.ops[0].insert : "" });
				console.log("time taken", Date.now()-time)
			})
			
			const res = await index.search("sit", { enrich: true })
			
			console.log("res", res)
		}

		setStartFakeLoad(true);
	}

	useEffect(()=> {
		loadDataFromStore();
	}, [])

    useEffect(()=> {
		// simulates loading

		// dummyData.forEach((data, i) => {
		// 	if(i<50) {

		// 		notesDb.notes.add({
		// 			id: generateId(),
		// 			noteName: data.title,
		// 			topics: [],
		// 			description: "",
		// 			createdAt: Date.now(),
		// 			lastModified: Date.now(),
		// 			content: new Delta().insert(data.description)
		// 		})	
		// 	}
		// })
		// notesDb.notes.add({
		// 	noteName: "",
		// 	topics: [],
		// 	description: "",
		// 	createdAt: 0,
		// 	lastModified: 0,
		// 	content: new Delta
		// })

		if(startFakeLoad) {

			setTimeout(()=> {
				gsap.fromTo(loaderRef.current, {opacity: 1}, {opacity: 0, duration: 0.3})
			}, 2700)
			setTimeout(()=> {
				setIsLoading(false)
				setStartFakeLoad(false)
			}, 3000)
		}
	},[startFakeLoad])



    return (
        <>
            {
                isLoading ? 
				<div ref={ loaderRef }>
					<InitialLoader/> 
				</div>
				: <AppView/>
            }
        </>
    );
};

export default AppPage;