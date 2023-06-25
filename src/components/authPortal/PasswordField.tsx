"use client"

import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import {
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../utils/store";
import { inputPassword } from "../../utils/storeSlices/userSlice";
import Joi from "joi";

export interface PasswordErrors {
    noPasswordServer: boolean;
    noLength: boolean;
    noUppercase: boolean;
    noLowercase: boolean;
    noNumber: boolean;
    noSymbol: boolean;
}

export const passwordFormSchema = Joi.string()
    .pattern(new RegExp("^.{8,19}$"), "length")
    .pattern(new RegExp("[0-9]"), "number")
    .pattern(new RegExp("[a-z]"), "lowercase")
    .pattern(new RegExp("[A-Z]"), "uppercase")
    .pattern(new RegExp("[^a-zA-Z0-9s\n]"), "special");

export const checkPasswordErrors = (
    password: string,
    errors: PasswordErrors
): PasswordErrors => {
    let intErrors = { ...errors };
    Object.keys(intErrors).forEach(
        (k) => (intErrors[k as keyof PasswordErrors] = false)
    );
    const validationRes = passwordFormSchema.validate(password, {
        abortEarly: false,
    });
    if (typeof validationRes.error === "undefined") {
        return intErrors;
    } else if (validationRes.error.details[0].type === "string.empty") {
        intErrors.noLength = true;
    } else {
        validationRes.error.details.forEach((d) => {
            if ((d.context?.name as string) === "length") {
                intErrors.noLength = true;
            }
            if ((d.context?.name as string) === "number") {
                intErrors.noNumber = true;
            }
            if ((d.context?.name as string) === "lowercase") {
                intErrors.noLowercase = true;
            }
            if ((d.context?.name as string) === "uppercase") {
                intErrors.noUppercase = true;
            }
            if ((d.context?.name as string) === "special") {
                intErrors.noSymbol = true;
            }
        });
    }
    return intErrors;
};

export const validatePassword = (errors: PasswordErrors): boolean => {
    for (const err in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, err)) {
            if (errors[err as keyof PasswordErrors]) return false;
        }
    }
    return true;
};

const PasswordField = ({
    errors: {
        noLength,
        noNumber,
        noPasswordServer,
        noSymbol,
        noUppercase,
        noLowercase,
    },
    onEnter,
    controlledShowPass = undefined,
    handleControlledShowPass = () => {},
}: {
    errors: PasswordErrors;
    onEnter: () => void;
    controlledShowPass?: boolean | undefined;
    handleControlledShowPass?: () => void;
}) => {
    const dispatch = useDispatch();
    const storePasswordValue = useSelector(
        (state: RootState) => state.user.password
    );

    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl
            variant="outlined"
            size="small"
            color="secondary"
            error={
                noLength ||
                noNumber ||
                noPasswordServer ||
                noSymbol ||
                noUppercase
            }
        >
            <InputLabel htmlFor="password" color="secondary">
                Password
            </InputLabel>
            <OutlinedInput
                id="password"
                autoComplete="test"
                type={showPassword || controlledShowPass ? "text" : "password"}
                label="Password"
                color="secondary"
                value={storePasswordValue}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        onEnter();
                        e.preventDefault();
                    } else return;
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(inputPassword(e.target.value));
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                                if (typeof controlledShowPass === "undefined")
                                    setShowPassword(!showPassword);
                                else handleControlledShowPass();
                            }}
                            edge="end"
                        >
                            {showPassword || controlledShowPass ? (
                                <VisibilityOffOutlined />
                            ) : (
                                <VisibilityOutlined />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <FormHelperText>
                {noPasswordServer ? (
                    <span>
                        - Incorrect password <br />
                    </span>
                ) : (
                    ""
                )}
                {noLength ? (
                    <span>
                        - Password should be between 8 and 20 characters long{" "}
                        <br />
                    </span>
                ) : (
                    ""
                )}
                {noNumber ? (
                    <span>
                        - Password should contain at least one number <br />
                    </span>
                ) : (
                    ""
                )}
                {noUppercase ? (
                    <span>
                        - Password should contain at least one uppercase letter
                        <br />
                    </span>
                ) : (
                    ""
                )}
                {noLowercase ? (
                    <span>
                        - Password should contain at least one lowercase letter
                        <br />
                    </span>
                ) : (
                    ""
                )}
                {noSymbol ? (
                    <span>
                        - Password should contain at least one symbol - ().@#
                        etc
                        <br />
                    </span>
                ) : (
                    ""
                )}
            </FormHelperText>
        </FormControl>
    );
};

export default PasswordField;

export const PasswordFieldPlain = ({
    onRepeatPassInput,
    noPassMatch,
    onEnter,
    controlledShowPass = undefined,
    handleControlledShowPass = () => {},
}: {
    onRepeatPassInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    noPassMatch: boolean;
    onEnter: () => void;
    controlledShowPass?: boolean | undefined;
    handleControlledShowPass?: () => void;
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormControl
            variant="outlined"
            size="small"
            color="secondary"
            error={noPassMatch}
        >
            <InputLabel htmlFor="password" color="secondary">
                Repeat Password
            </InputLabel>
            <OutlinedInput
                id="passwordPlain"
                autoComplete="test"
                type={showPassword || controlledShowPass ? "text" : "password"}
                label="Repeat Password"
                color="secondary"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        onEnter();
                        e.preventDefault();
                    } else return;
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onRepeatPassInput(e);
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                                if (typeof controlledShowPass === "undefined")
                                    setShowPassword(!showPassword);
                                else handleControlledShowPass();
                            }}
                            edge="end"
                        >
                            {showPassword || controlledShowPass ? (
                                <VisibilityOffOutlined />
                            ) : (
                                <VisibilityOutlined />
                            )}
                        </IconButton>
                    </InputAdornment>
                }
            />
            <FormHelperText>
                {noPassMatch ? (
                    <span>
                        - Passwords don't match<br></br>
                    </span>
                ) : (
                    ""
                )}
            </FormHelperText>
        </FormControl>
    );
};
