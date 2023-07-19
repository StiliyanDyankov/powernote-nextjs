"use client"

import { useState, useEffect } from "react";
import PasswordField, {
    checkPasswordErrors,
    PasswordErrors,
    PasswordFieldPlain,
    validatePassword,
} from "./PasswordField";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import { clearPassword } from "../../utils/storeSlices/userSlice";
import { usePasswordErrors, useTransitionRef } from "../../utils/hooks";
import { usePostForgotChangePasswordMutation } from "../../utils/apiService";
import { AuthResponse, ResCredentialError, ResCredentialSuccess } from "./RegisterSection";
import { setToken } from "../../utils/storeSlices/tokenSlice";

const ResetPasswordSection = ({ onSubmit }: { onSubmit: () => void }) => {
    const dispatch = useDispatch();

    const transitionRef = useTransitionRef();

    const storePasswordValue = useSelector(
        (state: RootState) => state.user.password
    );
    const token = useSelector((state: RootState) => state.token);

    const [postCredentials, { data, error, isLoading }] =
        usePostForgotChangePasswordMutation();

    const [serverError, setServerError] = useState<boolean>(false);

    const [repeatPass, setRepeatPass] = useState<string>("");

    const [noPassMatch, setNoPassMatch] = useState<boolean>(false);

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

    const handleSubmit = async () => {
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

        await postCredentials({
            password: { newPassword: storePasswordValue },
            token,
        }).unwrap().then(async (p)=> {
            // handle 200
            const payload = p as AuthResponse;
            
            const token = payload.data?.token as string;

            dispatch(setToken(token));

            // simulating fetching
            // await new Promise((r) => setTimeout(r, 3000));

            onSubmit();
        }).catch((err)=> {
            // handle all that isn't 200
            const error = err as { data: AuthResponse, status: number };

            console.log(error);
            
            if(error.status === 500) {
                setServerError(true);
            
            } else if(error.data.error?.type === "PASSWORD_ERROR") {
                setPasswordErrors(error.data.error.errors as PasswordErrors);
            }
        });
    };

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
                <h1 className="form-header">Reset password</h1>
                {/* form-wrap */}
                <form className="flex flex-col items-stretch gap-4 ">
                    <div className="form-text">Enter your new password:</div>
                    <PasswordField
                        errors={passwordErrors}
                        onEnter={handleSubmit}
                        controlledShowPass={controlledShowPassword}
                        handleControlledShowPass={handleControlledShowPassword}
                    />
                    <div className="form-text">Confirm new password:</div>
                    <PasswordFieldPlain
                        onRepeatPassInput={handleRepeatPassInput}
                        noPassMatch={noPassMatch}
                        onEnter={handleSubmit}
                        controlledShowPass={controlledShowPassword}
                        handleControlledShowPass={handleControlledShowPassword}
                    />
                    <Button
                        className="flex-1"
                        variant="contained"
                        type="submit"
                        disableElevation
                        disabled={isLoading}
                        size="large"
                        fullWidth
                        color="secondary"
                        onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                            e.preventDefault();
                            handleSubmit();
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
                            {isLoading ? "Loading..." : "Reset Password"}
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

export default ResetPasswordSection;
