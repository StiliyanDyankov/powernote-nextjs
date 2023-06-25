"use client"

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import PinInput from "./PinInput";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    Link as LinkMUI,
} from "@mui/material";
import { setPin as setPinStore } from "../../utils/storeSlices/registerSlice";
import { useTransitionRef } from "../../utils/hooks";
import {
    usePostForgotCodeMutation,
    usePostRegisterCodeMutation,
    usePostResendCodeMutation,
} from "../../utils/apiService";
import { ResCredentialError, ResCredentialSuccess } from "./RegisterSection";
import { setToken } from "../../utils/storeSlices/tokenSlice";

const VerificationSection = ({
    onNext,
    onBack,
    type,
}: {
    onNext: () => void;
    onBack: () => void;
    type: "register" | "forgot";
}) => {
    const dispatch = useDispatch();

    const token = useSelector((state: RootState) => state.token);

    const ref = useTransitionRef();

    const [postRegisterCode, { data, error, isLoading }] =
        usePostRegisterCodeMutation();

    const [
        postForgotCode,
        { data: forgotData, error: forgotResend, isLoading: forgotIsLoading },
    ] = usePostForgotCodeMutation();

    const [
        postResend,
        { data: resendData, error: resendError, isLoading: resendIsLoading },
    ] = usePostResendCodeMutation();

    const [serverError, setServerError] = useState<boolean>(false);

    const [showResendAlert, setShowResendAlert] = useState<boolean>(false);

    const [pin, setPin] = useState<string>("");
    const [pinError, setPinError] = useState<boolean>(false);

    const handlePinStoring = (values: string[]) => {
        const pin = values.filter((val) => val !== "");
        if (pin.length > 0) {
            const strPin = pin.reduce((acc, curr) => acc + curr);
            setPin(strPin);
        } else return;
    };

    const handleVerify = async () => {
        if (pin.length === 5) {
            dispatch(setPinStore(pin));
        } else {
            setPinError(true);
            return;
        }

        let res = {};

        if (type === "register") {
            res = await postRegisterCode({
                code: { verificationCode: pin },
                token,
            });

            if ((res as ResCredentialError).error) {
                if ((res as ResCredentialError).error.status === 500) {
                    setServerError(true);
                    return;
                }
                setPinError(true);
                return;
            }
        }

        if (type === "forgot") {
            res = await postForgotCode({
                code: { verificationCode: pin },
                token,
            });
            if ((res as ResCredentialError).error) {
                if ((res as ResCredentialError).error.status === 500) {
                    setServerError(true);
                    return;
                }
                setPinError(true);
                return;
            }
        }

        if ((res as unknown as ResCredentialSuccess).data) {
            const token = (
                res as unknown as ResCredentialSuccess
            ).data.token.substring(7);
            dispatch(setToken(token));
        }

        onNext();
    };

    const handleEnter = () => {
        handleVerify();
    };

    const handleResend = async () => {
        const res = await postResend({ token });

        if ((res as { data: any }).data) {
            const token = (
                res as unknown as ResCredentialSuccess
            ).data.token.substring(7);
            dispatch(setToken(token));
            setShowResendAlert(true);
        }
    };

    useEffect(() => {
        if (pinError) {
            setPinError(false);
        }
    }, [pin]);

    useEffect(() => {
        if (showResendAlert) {
            setTimeout(() => {
                setShowResendAlert(false);
            }, 3000);
        }
    }, [showResendAlert]);

    return (
        <div ref={ref} className="content-box">
            {/* content-wrap */}
            <div className="content-wrap">
                <h1 className="form-header">Verify yourself</h1>
                {/* form-wrap */}
                <form className="flex flex-col items-stretch gap-4 ">
                    <div className="dark:text-d-700-text">
                        We've sent you a verification code on your email. To
                        proceed with the registration enter the code bellow:
                    </div>
                    <PinInput
                        onPinStoring={handlePinStoring}
                        error={pinError}
                        onEnter={handleEnter}
                    />
                    <div className="flex flex-row content-center justify-start gap-3">
                        <div className="form-text">Didn't recieve a code?</div>
                        <LinkMUI
                            className="font-medium w-min whitespace-nowrap dark:font-semibold dark:text-d-700-text"
                            color="secondary"
                            underline="hover"
                            type="submit"
                            href="#"
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLAnchorElement,
                                    MouseEvent
                                >
                            ) => {
                                e.preventDefault();
                                handleResend();
                            }}
                        >
                            Resend code
                        </LinkMUI>
                    </div>
                    {showResendAlert && (
                        <Alert severity="success">
                            Verification code has been sent to your email
                        </Alert>
                    )}
                    <div className="flex flex-row gap-2">
                        <div className="w-1/4">
                            <Button
                                variant="outlined"
                                disableElevation
                                size="large"
                                fullWidth
                                color="secondary"
                                onClick={(
                                    e: React.MouseEvent<
                                        HTMLButtonElement,
                                        MouseEvent
                                    >
                                ) => {
                                    e.preventDefault();
                                    onBack();
                                }}
                            >
                                <span className="flex-grow font-bold text-center text-gray-50">
                                    Back
                                </span>
                            </Button>
                        </div>
                        <Button
                            className="flex-1"
                            variant="contained"
                            type="submit"
                            disableElevation
                            disabled={isLoading || forgotIsLoading}
                            size="large"
                            fullWidth
                            color="secondary"
                            onClick={(
                                e: React.MouseEvent<
                                    HTMLButtonElement,
                                    MouseEvent
                                >
                            ) => {
                                handleVerify();
                                e.preventDefault();
                            }}
                            endIcon={
                                isLoading || forgotIsLoading ? (
                                    <CircularProgress
                                        color="secondary"
                                        size={25}
                                    />
                                ) : null
                            }
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <span className="font-bold text-gray-50 flex-grow text-center">
                                {isLoading || forgotIsLoading ? "Loading..." : "Verify"}
                            </span>
                        </Button>
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

export default VerificationSection;
