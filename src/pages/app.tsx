import { useEffect, useRef, useState } from "react";
import InitialLoader from "@/components/app/InitialLoader";
import gsap from "gsap";
import AppView from "@/components/app/AppView";



const AppPage = () => {

	const loaderRef = useRef(null)

    const [isLoading, setIsLoading] = useState<boolean>(true);
	
    useEffect(()=> {
		// simulates loading

		setTimeout(()=> {
			gsap.fromTo(loaderRef.current, {opacity: 1}, {opacity: 0, duration: 0.3})
		}, 2700)
		setTimeout(()=> {
			setIsLoading(false)
		}, 3000)
	},[])

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