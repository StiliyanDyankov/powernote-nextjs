"use client"

import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/store";
import TextField from "@mui/material/TextField";
import { inputEmail } from "../../utils/storeSlices/userSlice";
import Joi from "joi";

export interface EmailErrors {
    alreadyExists: boolean;
    noEmailServer: boolean;
    invalidEmailForm: boolean;
}

export const emailFormSchema = Joi.string().email({
    tlds: { allow: false },
});

export const checkEmailErrors = (
    email: string,
    errors: EmailErrors
): EmailErrors => {
    let intErrors = { ...errors };
    Object.keys(intErrors).forEach(
        (k) => (intErrors[k as keyof EmailErrors] = false)
    );
    const validationRes = emailFormSchema.validate(email);
    if (typeof validationRes.error === "undefined") {
        return intErrors;
    } else {
        intErrors.invalidEmailForm = true;
        return intErrors;
    }
};

export const validateEmail = (errors: EmailErrors): boolean => {
    for (const err in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, err)) {
            if (errors[err as keyof EmailErrors]) return false;
        }
    }
    return true;
};

const EmailField = ({
    errors: { noEmailServer, invalidEmailForm, alreadyExists },
    onEnter,
}: {
    errors: EmailErrors;
    onEnter: () => void;
}) => {
    const dispatch = useDispatch();

    const storeEmailValue = useSelector((state: RootState) => state.user.email);

    const evalHelper = (noEmailServer: boolean, invalidEmailForm: boolean) => {
        if (noEmailServer) return "- No account with such email found";
        if (invalidEmailForm) return "- Invalid email";
        return "";
    };

    return (
        <React.Fragment>
            <TextField
                id="outlined-basic"
                autoComplete="test"
                autoFocus={true}
                label="Email"
                variant="outlined"
                size="small"
                color="secondary"
                value={storeEmailValue}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        onEnter();
                    } else return;
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(inputEmail(e.target.value));
                }}
                error={noEmailServer || invalidEmailForm || alreadyExists}
                helperText={
                    <React.Fragment>
                        {alreadyExists ? (
                            // Error for register page
                            <span>
                                - Account with such email already exists <br />
                            </span>
                        ) : (
                            ""
                        )}
                        {invalidEmailForm ? (
                            // Error for register page
                            <span>
                                - Invalid email <br />
                            </span>
                        ) : (
                            ""
                        )}
                        {noEmailServer ? (
                            // Error for login page
                            <span>
                                - No account with such email exists <br />
                            </span>
                        ) : (
                            ""
                        )}
                    </React.Fragment>
                }
            />
        </React.Fragment>
    );
};

export default EmailField;
