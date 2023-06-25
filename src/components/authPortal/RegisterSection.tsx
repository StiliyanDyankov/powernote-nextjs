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
} from "@mui/material";
// import { useHref } from "react-router-dom";
// import { useLinkClickHandler } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { clearPassword } from "../../utils/storeSlices/userSlice";
import {
    useEmailErrors,
    usePasswordErrors,
    useTransitionRef,
} from "../../utils/hooks";
import { usePostRegisterCredentialsMutation } from "../../utils/apiService";
import { goNextStep } from "../../utils/storeSlices/registerSlice";
import { setToken } from "../../utils/storeSlices/tokenSlice";
import Router from "next/router";

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
        message: string;
        token: string;
    };
}

const RegisterSection = ({ onRegister }: { onRegister: () => void }) => {
    const dispatch = useDispatch();
    const storeEmailValue = useSelector((state: RootState) => state.user.email);
    const storePasswordValue = useSelector(
        (state: RootState) => state.user.password
    );

    const [postCredentials, { data, error, isLoading }] =
        usePostRegisterCredentialsMutation();

    const transitionRef = useTransitionRef();

    const [serverError, setServerError] = useState<boolean>(false);

    const [repeatPass, setRepeatPass] = useState<string>("");

    const [noPassMatch, setNoPassMatch] = useState<boolean>(false);

    const [emailErrors, setEmailErrors] = useEmailErrors();

    const [passwordErrors, setPasswordErrors] =
        usePasswordErrors(setNoPassMatch);

    const [controlledShowPassword, setControlledShowPassword] =
        useState<boolean>(false);

    // const loginURL = useHref("/login");
    // const handleLoginLink = useLinkClickHandler("/login");

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

        // handle request
        const res = await postCredentials({
            email: storeEmailValue,
            password: storePasswordValue,
        });

        if ((res as ResCredentialError).error) {
            if ((res as ResCredentialError).error.status === 500) {
                setServerError(true);
                return;
            }
            if (
                (
                    (res as ResCredentialError).error.data.errors as EmailErrors
                ).hasOwnProperty("alreadyExists")
            ) {
                setEmailErrors(
                    (res as ResCredentialError).error.data.errors as EmailErrors
                );
                return;
            }
            if (
                (
                    (res as ResCredentialError).error.data
                        .errors as PasswordErrors
                ).hasOwnProperty("noPasswordServer")
            ) {
                setPasswordErrors(
                    (res as ResCredentialError).error.data
                        .errors as PasswordErrors
                );
                return;
            }
            return;
        }

        if ((res as unknown as ResCredentialSuccess).data) {
            const token = (
                res as unknown as ResCredentialSuccess
            ).data.token.substring(7);
            dispatch(setToken(token));
        }

        onRegister();
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

    return (
        <div ref={transitionRef} className="content-box">
            {/* content-wrap */}
            <div className="content-wrap">
                <h1 className="form-header">Register</h1>
                {/* form-wrap */}
                <form className="flex flex-col items-stretch gap-4 ">
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
