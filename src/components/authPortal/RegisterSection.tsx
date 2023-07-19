"use client"

import EmailField, {
    EmailErrors,
    checkEmailErrors,
    validateEmail,
} from "./EmailField";
import { useState, useEffect } from "react";
import PasswordField, {
    checkPasswordErrors,
    PasswordErrors,
    PasswordFieldPlain,
    validatePassword,
} from "./PasswordField";
import {
    Alert,
    Button,
    CircularProgress,
    Link as LinkMUI,
    TextField,
} from "@mui/material";
// import { useHref } from "react-router-dom";
// import { useLinkClickHandler } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { clearPassword, inputFirstName, inputLastName } from "../../utils/storeSlices/userSlice";
import {
    useEmailErrors,
    usePasswordErrors,
    useTransitionRef,
} from "../../utils/hooks";
import { usePostRegisterCredentialsMutation } from "../../utils/apiService";
import { goNextStep } from "../../utils/storeSlices/registerSlice";
import { setToken } from "../../utils/storeSlices/tokenSlice";
import Router from "next/router";
import React from "react";

export interface ResCredentialError {
        error: {
            data: {
                errors: EmailErrors | PasswordErrors;
                message: string;
            };
            status: number;
        };
}

export interface ResCredentialSuccess {
    data: {
        data: {
            message: string;
            token: string;
        };
    }
}

export interface AuthResponse {
    data?: {
        token: string;
        message?: string;
    };
    error?: {
        message: string;
        type?: "EMAIL_ERROR" | "PASSWORD_ERROR";
        errors: EmailErrors | PasswordErrors;
    };
}

const RegisterSection = ({ onRegister }: { onRegister: () => void }) => {
    const dispatch = useDispatch();
    const storeEmailValue = useSelector((state: RootState) => state.user.email);
    const storePasswordValue = useSelector(
        (state: RootState) => state.user.password
    );

    const storeFirstNameValue = useSelector((state: RootState) => state.user.firstName);
    const storeLastNameValue = useSelector((state: RootState) => state.user.lastName);

    const [postCredentials, { isLoading }] =
        usePostRegisterCredentialsMutation();

    const transitionRef = useTransitionRef();

    const [serverError, setServerError] = useState<boolean>(false);

    const [repeatPass, setRepeatPass] = useState<string>("");

    const [noPassMatch, setNoPassMatch] = useState<boolean>(false);

    const [firstNameIsEmpty, setFirstNameIsEmpty] = useState<boolean>(false);
    
    const [lastNameIsEmpty, setLastNameIsEmpty] = useState<boolean>(false);

    const [emailErrors, setEmailErrors] = useEmailErrors();

    const [passwordErrors, setPasswordErrors] =
        usePasswordErrors(setNoPassMatch);

    const [controlledShowPassword, setControlledShowPassword] =
        useState<boolean>(false);

    const handleControlledShowPassword = () => {
        setControlledShowPassword(!controlledShowPassword);
    };

    const handleRepeatPassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPass(e.target.value);
    };

    const handleRegister = async () => {
        const emailCheckedErrors = checkEmailErrors(
            storeEmailValue,
            emailErrors
        );

        if(storeFirstNameValue.length === 0) {
            setFirstNameIsEmpty(true);
            return;
        }

        if(storeLastNameValue.length === 0) {
            setLastNameIsEmpty(true);
            return;
        }

        setEmailErrors(emailCheckedErrors);
        if (!validateEmail(emailCheckedErrors)) {
            return;
        }

        const passwordCheckedErrors = checkPasswordErrors(
            storePasswordValue,
            passwordErrors
        );

        setPasswordErrors(passwordCheckedErrors);
        if (!validatePassword(passwordCheckedErrors)) {
            return;
        }

        if (repeatPass !== storePasswordValue) {
            setNoPassMatch(true);
            return;
        }

        console.log({
            firstName: storeFirstNameValue,
            lastName: storeLastNameValue,
            email: storeEmailValue,
            password: storePasswordValue,
        });
        
        // handle request
        await postCredentials({
            firstname: storeFirstNameValue,
            lastname: storeLastNameValue,
            email: storeEmailValue,
            password: storePasswordValue,
        }).unwrap().then((p)=> {
            // handle 200
            const payload = p as AuthResponse;
            
            const token = payload.data?.token as string;

            dispatch(setToken(token));

            onRegister();

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

    // clear repeat password error on input
    useEffect(() => {
        setNoPassMatch(false);
    }, [repeatPass]);

    useEffect(() => {
        return () => {
            dispatch(clearPassword());
        };
    }, []);

    function onEnter() {
        throw new Error("Function not implemented.");
    }

    return (
        <div ref={transitionRef} className="content-box">
            {/* content-wrap */}
            <div className="content-wrap">
                <h1 className="form-header">Register</h1>
                {/* form-wrap */}
                <form className="flex flex-col items-stretch gap-4 ">
                    <div className="flex flex-row gap-4">
                        <TextField
                            id="outlined-basic"
                            autoComplete="test"
                            autoFocus={true}
                            error={firstNameIsEmpty}
                            label="First Name"
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={storeFirstNameValue}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if(firstNameIsEmpty) setFirstNameIsEmpty(false);
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    onEnter();
                                } else return;
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(inputFirstName(e.target.value));
                            }}
                            helperText={
                                <React.Fragment>
                                    {firstNameIsEmpty ? (
                                        <span>
                                            - First Name cannot be empty <br />
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </React.Fragment>
                            }
                        />
                        <TextField
                            id="outlined-basic"
                            autoComplete="test"
                            autoFocus={true}
                            error={lastNameIsEmpty}
                            label="Last Name"
                            variant="outlined"
                            size="small"
                            color="secondary"
                            value={storeLastNameValue}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if(lastNameIsEmpty) setLastNameIsEmpty(false);
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    onEnter();
                                } else return;
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(inputLastName(e.target.value));
                            }}
                            helperText={
                                <React.Fragment>
                                    {lastNameIsEmpty ? (
                                        <span>
                                            - Last Name cannot be empty <br />
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </React.Fragment>
                            }
                        />
                    </div>
                    <EmailField errors={emailErrors} onEnter={handleRegister} />
                    <PasswordField
                        errors={passwordErrors}
                        onEnter={handleRegister}
                        controlledShowPass={controlledShowPassword}
                        handleControlledShowPass={handleControlledShowPassword}
                    />
                    <div className="form-text">Confirm password:</div>
                    <PasswordFieldPlain
                        onRepeatPassInput={handleRepeatPassInput}
                        noPassMatch={noPassMatch}
                        onEnter={handleRegister}
                        controlledShowPass={controlledShowPassword}
                        handleControlledShowPass={handleControlledShowPassword}
                    />
                    <Button
                        className="flex flex-row "
                        variant="contained"
                        disabled={isLoading}
                        disableElevation
                        size="large"
                        fullWidth
                        color="secondary"
                        onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                            e.preventDefault();
                            handleRegister();
                        }}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                        endIcon={
                            isLoading ? (
                                <CircularProgress color="secondary" size={25} />
                            ) : null
                        }
                    >
                        <span className="flex-grow font-bold text-center text-gray-50">
                            {isLoading ? "Loading..." : "Register"}
                        </span>
                    </Button>
                    <div className="flex flex-row content-center justify-start gap-3">
                        <div className="form-text">
                            Already have an account?
                        </div>
                        <LinkMUI
                            className="font-medium w-min whitespace-nowrap dark:font-semibold dark:text-d-700-text"
                            color="secondary"
                            underline="hover"
                            href={"/login"}
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLAnchorElement,
                                    MouseEvent
                                >
                            ) => {
                                e.preventDefault();
                                Router.push("login");
                                // handleLoginLink(e);
                            }}
                        >
                            Login
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
    );
};

export default RegisterSection;
