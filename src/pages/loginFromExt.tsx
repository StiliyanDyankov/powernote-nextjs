"use client"

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTransitionRef } from "../utils/hooks";
import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import AuthPageWrapper from "@/components/authPortal/AuthPageWrapper";

const LoginFromExt = () => {

    const dispatch = useDispatch();

    const ref = useTransitionRef();

    useEffect(()=> {
        setTimeout(()=> {
            // window.location.assign('https://react.dev/reference/react')
            console.log("runs the mf thing")
            window.close();
            // window.location.
            // window.open('https://react.dev/reference/react', 'child');
        }, 3000)
    }, [])
    return (
        <AuthPageWrapper>
            <React.Fragment>
                <div ref={ref} className="content-box">
                    <div className="content-wrap">
                        <div className="form-header">
                            <Typography variant="body1" color="green">
                                <span className="flex flex-row items-center justify-center">
                                    <CheckCircle />
                                    <span className="pl-2 font-medium text-2xl">
                                        Success!
                                    </span>
                                </span>
                            </Typography>
                        </div>
                        <p className="form-text text-lg text-left">
                            {"You've successfully loged-in!"} <br /> Enjoy your stay!
                        </p>
                        <div className="flex flex-col gap-2 justify-center">

                            <p className="form-text text-lg mt-3">
                                {"You'll be redirected to the extension shortly."} 
                            </p>
                            <div className="flex justify-center">

                                <CircularProgress color="secondary" size={32}/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        </AuthPageWrapper>
    );
}
 
export default LoginFromExt;