"use client"

import Image from "next/image";
import LogoSvg from "../../../public/krisinoteLogo.svg"
import { useEffect, useRef } from "react";
import  gsap  from "gsap";
import { CircularProgress } from "@mui/material";

const InitialLoader = () => {

    const pathRef = useRef(null);
    
    const pathRef1 = useRef(null);
    const pathRef2 = useRef(null);
    const pathRef3 = useRef(null);
    const pathRef4 = useRef(null);
    const pathRef5 = useRef(null);
    const pathRef6 = useRef(null);

    useEffect(()=> {
        let path1 = pathRef1.current as any;
        let length1 = path1.getTotalLength();

        gsap.set(path1, {strokeDasharray: length1})
        gsap.fromTo(path1, { strokeDashoffset: length1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path1, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        

        //

        let path2 = pathRef2.current as any;
        let length2 = path2.getTotalLength();

        gsap.set(path2, {strokeDasharray: length2})
        gsap.fromTo(path2, { strokeDashoffset: length2 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path2, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        

        //

        let path3 = pathRef3.current as any;
        let length3 = path3.getTotalLength();

        gsap.set(path3, {strokeDasharray: length3})
        gsap.fromTo(path3, { strokeDashoffset: length3 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path3, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        

        //

        let path4 = pathRef4.current as any;
        let length4 = path4.getTotalLength();

        gsap.set(path4, {strokeDasharray: length4})
        gsap.fromTo(path4, { strokeDashoffset: length4 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path4, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        


        //

        let path5 = pathRef5.current as any;
        let length5 = path5.getTotalLength();

        gsap.set(path5, {strokeDasharray: length5})
        gsap.fromTo(path5, { strokeDashoffset: length5 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path5, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        


        //

        let path6 = pathRef6.current as any;
        let length6 = path6.getTotalLength();

        gsap.set(path6, {strokeDasharray: length6})
        gsap.fromTo(path6, { strokeDashoffset: length6 }, { strokeDashoffset: 0, duration: 1.5, ease: "power1", repeat: -1, });
        gsap.fromTo(path6, { opacity: 0.5 }, { opacity:1, duration: 0.2, ease: "power1", repeat: -1, repeatDelay: 1.3 });
        

    }, [])

    return (
        <>
            <div
                style={{
                    width: "100vw",
                    height:"100vh",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent:"center",
                    overflowY: "hidden",
                }}
                className="bg-l-workscreen-bg dark:bg-d-100-body-bg"
            >   
                <div
                    className="relative"
                >

                <CircularProgress
                    color="secondary"
                    className="absolute left-56 bottom-72"
                />
                {/* <p>Loading...</p> */}
                <svg
                    id="layer1"
                    width="500px"
                    height="800px"
                    viewBox="0 0 70 320"
                >
                    <path
                        ref={pathRef1}
                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeDasharray: "none",
                            strokeOpacity: 1
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 36.02282,135.13438 v 32.72955"
                    />
                    <path
                        ref={pathRef2}
                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeDasharray: "none",
                            strokeOpacity: 1
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 61.56176,135.13435 v 32.72956"
                    />
                    <path
                        ref={pathRef3}

                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeDasharray: "none",
                            strokeOpacity: 1
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 35.92789,135.13435 25.58437,32.72956"
                    />
                    <path
                        ref={pathRef4}
                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeOpacity: 1,
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 0.39832,135.13435 v 32.58924"
                    />
                    <path
                        ref={pathRef5}
                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeDasharray: "none",
                            strokeOpacity: 1
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 9.65805,148.67007 14.8092,19.14048"
                    />
                    <path
                        ref={pathRef6}
                        style={{
                            opacity: 1,
                            fill: "#000",
                            // stroke: "black",
                            strokeLinecap: "round",
                            strokeWidth: "5.68536",
                            strokeDasharray: "none",
                            strokeOpacity: 1
                        }}
                        className="stroke-l-secondary dark:stroke-d-500-divider"
                        d="m 0.44319,157.10517 23.8792,-21.87407"
                    />
                </svg>
                </div>

            </div>
        </>
    );
}

export default InitialLoader;