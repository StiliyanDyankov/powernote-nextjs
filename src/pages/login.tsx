"use client"

import React, { useRef, useState } from "react";
import { useEffect } from "react";
// import { useHref, useLinkClickHandler, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PasswordField, { PasswordErrors } from "@/components/authPortal/PasswordField";
import AuthPageWrapper from "@/components/authPortal/AuthPageWrapper";
import { Alert, Button, CircularProgress, Link as LinkMUI } from "@mui/material";
import { RootState } from "../utils/store";
import { clearPassword } from "../utils/storeSlices/userSlice";
import EmailField, { EmailErrors } from "@/components/authPortal/EmailField";
import {
    useEmailErrors,
    usePasswordErrors,
    useTransitionRef,
} from "./../utils/hooks";
import { usePostLoginMutation } from "../utils/apiService";
import { AuthResponse, ResCredentialError, ResCredentialSuccess } from "@/components/authPortal/RegisterSection";
import { setToken } from "../utils/storeSlices/tokenSlice";
import Router from "next/router";

// let isComingFromExt = false

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();

    const [postLogin, { data, error, isLoading }] = usePostLoginMutation();

    const storeEmailValue = useSelector((state: RootState) => state.user.email);
    const storePasswordValue = useSelector(
        (state: RootState) => state.user.password
    );
    
    // const isComingFromExt = useRef(false);

    const ref = useTransitionRef();

    const [serverError, setServerError] = useState<boolean>(false);

    const [emailErrors, setEmailErrors] = useEmailErrors();

    const [passwordErrors, setPasswordErrors] = usePasswordErrors();


    const handleLogin = async () => {

        await postLogin({
            email: storeEmailValue,
            password: storePasswordValue,
        }).unwrap().then(async (p)=> {
            // handle 200
            const payload = p as AuthResponse;
            
            const token = payload.data?.token as string;

            dispatch(setToken(token));

            const successfullLoginEvent = new CustomEvent("successfulLogin", { detail: { token: token } });
            
            window.dispatchEvent(successfullLoginEvent);

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const myParam = urlParams.get('loginFromExt');

            if(myParam) { console.log("hey, it's coming from ext!"); Router.push("/loginFromExt")}

            else { Router.push("/app") }

            // simulating fetching
            // await new Promise((r) => setTimeout(r, 3000));

            
        }).catch((err)=> {
            // handle all that isn't 200
            const error = err as { data: AuthResponse, status: number };

            console.log(error);
            
            if(error.status === 500) {
                setServerError(true);
            
            } else if(error.data.error?.type === "EMAIL_ERROR") {
                setEmailErrors(error.data.error.errors as EmailErrors);
            
            } else if(error.data.error?.type === "PASSWORD_ERROR") {
                setPasswordErrors(error.data.error.errors as PasswordErrors);
            }
        });
    };

    useEffect(() => {
        // window.postMessage({message: "hey, its me, the injected script", type: "FROM_REACT_APP"})
        // window.addEventListener("message", receiveMessage)
        // console.log("has run attaching of message listener");
        
        return () => {
            dispatch(clearPassword());
            console.log("im diyinggggg")
            window.postMessage({message: "hey, its me, the injected script", type: "FROM_REACT_APP"})
        };
    }, []);

    // const receiveMessage = (event: MessageEvent) => {
    //     console.log(event);
    //     if(event.data.type === "FROM_CONTENT_SCRIPT") {

    //         isComingFromExt = true;
    //         window.removeEventListener("message", receiveMessage);
    //     }  
    // };

    return (
        <AuthPageWrapper>
            {/* content-box */}
            <div ref={ref} className="content-box">
                {/* content-wrap */}
                <div className="content-wrap">
                    <h1 className="form-header">Login</h1>
                    {/* form-wrap */}
                    <form className="flex flex-col items-stretch gap-4 ">
                        {/* <form> */}
                        <EmailField
                            errors={emailErrors}
                            onEnter={handleLogin}
                        />
                        <PasswordField
                            errors={passwordErrors}
                            onEnter={handleLogin}
                        />
                        <LinkMUI
                            className="font-medium w-min whitespace-nowrap dark:font-semibold dark:text-d-700-text"
                            color="secondary"
                            href="/forgottenPassword"
                            underline="hover"
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLAnchorElement,
                                    MouseEvent
                                >
                            ) => {
                                Router.push("/forgottenPassword");
                                e.preventDefault();
                                // handleForgotLink(e);
                            }}
                        >
                            Forgotten password?
                        </LinkMUI>
                        <Button
                            className="flex flex-row "
                            variant="contained"
                            type="submit"
                            disableElevation
                            disabled={isLoading}
                            size="large"
                            fullWidth
                            color="secondary"
                            href={"/forgottenPassword"}
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLAnchorElement,
                                    MouseEvent
                                >
                            ) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                            endIcon={
                                isLoading ? (
                                    <CircularProgress
                                        color="secondary"
                                        size={25}
                                    />
                                ) : null
                            }
                        >
                            <span className="font-bold text-gray-50 flex-grow text-center">
                                {isLoading ? "Loading..." : "Login"}
                            </span>
                        </Button>
                        {/* </form> */}
                        <div className="flex flex-row content-center justify-start gap-3">
                            <div className="form-text">Not a member?</div>
                            <LinkMUI
                                className="font-medium w-min whitespace-nowrap dark:font-semibold dark:text-d-700-text"
                                color="secondary"
                                underline="hover"
                                href={"/register"}
                                onClick={(
                                    e: React.MouseEvent<
                                        HTMLAnchorElement,
                                        MouseEvent
                                    >
                                ) => {
                                    Router.push("/register")
                                    e.preventDefault();

                                    // handleRegisterLink(e);
                                }}
                            >
                                Register
                            </LinkMUI>
                        </div>
                        {serverError ? (
                            <Alert severity="error">
                                An unexpected error occured. —{" "}
                                <strong>Please try again later!</strong>
                            </Alert>
                        ) : null}
                    </form>
                </div>
            </div>
        </AuthPageWrapper>
    );
};

export default LoginPage;
