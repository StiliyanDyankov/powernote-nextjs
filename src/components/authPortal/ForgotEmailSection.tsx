"use client"

import EmailField, { EmailErrors } from "./EmailField";
import { useState, useEffect } from "react";
import {
    Button,
    Link as LinkMUI,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { clearPassword } from "../../utils/storeSlices/userSlice";
import { useEmailErrors, useTransitionRef } from "../../utils/hooks";
import { usePostForgotEmailAuthMutation } from "../../utils/apiService";
import { ResCredentialError, ResCredentialSuccess } from "./RegisterSection";
import { setToken } from "../../utils/storeSlices/tokenSlice";

const ForgotEmailSection = ({ onSubmit }: { onSubmit: () => void }) => {
    const dispatch = useDispatch();

    const [postCredentials, { data, error, isLoading }] =
        usePostForgotEmailAuthMutation();

    const transitionRef = useTransitionRef();

    const storeEmailValue = useSelector((state: RootState) => state.user.email);

    const [emailErrors, setEmailErrors] = useEmailErrors();

    const [serverError, setServerError] = useState<boolean>(false);

    const handleEmailSubmit = async () => {
        const res = await postCredentials({
            email: storeEmailValue,
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
            return;
        }

        if ((res as unknown as ResCredentialSuccess).data) {
            const token = (
                res as unknown as ResCredentialSuccess
            ).data.token.substring(7);
            dispatch(setToken(token));
        }

        onSubmit();
    };

    useEffect(() => {
        return () => {
            dispatch(clearPassword());
        };
    }, []);

    return (
        <div ref={transitionRef} className="content-box">
            {/* content-wrap */}
            <div className="content-wrap">
                <h1 className="form-header">Forgotten password</h1>
                {/* form-wrap */}
                <form className="flex flex-col items-stretch gap-4 ">
                    <div className="dark:text-d-700-text">
                        Forgot your password? No worries! <br /> 
                        {"Enter the email you've registered with bellow:"}
                    </div>

                    <EmailField
                        errors={emailErrors}
                        onEnter={handleEmailSubmit}
                    />
                    <Button
                        className="flex flex-row "
                        variant="contained"
                        disableElevation
                        disabled={isLoading}
                        size="large"
                        fullWidth
                        color="secondary"
                        onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                            handleEmailSubmit();
                            e.preventDefault();
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
                        <span className="font-bold text-gray-50 flex-grow text-center">
                            {isLoading ? "Loading..." : "Send verification"}
                        </span>
                    </Button>
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

export default ForgotEmailSection;
