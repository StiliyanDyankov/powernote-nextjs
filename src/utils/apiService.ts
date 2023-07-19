"use client"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthResponse, ResCredentialError, ResCredentialSuccess } from "@/components/authPortal/RegisterSection";

const server = "http://localhost:8081/api/v1/auth/";

interface Credentials {
    email: string;
    password: string;
}

// Define a service using a base URL and expected endpoints
export const Api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    endpoints: (builder) => ({
        postRegisterCredentials: builder.mutation<AuthResponse, any>({
            query: (credentials) => ({
                url: "register",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postRegisterCode: builder.mutation<AuthResponse, any>({
            query: ({ code, token }) => ({
                url: "verification/register",
                method: "POST",
                body: code,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postResendCode: builder.mutation<AuthResponse, any>({
            query: ({ token }) => ({
                url: "verification/newCode",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postLogin: builder.mutation<AuthResponse, any>({
            query: (credentials) => ({
                url: "authenticate",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotCode: builder.mutation<AuthResponse, any>({
            query: ({ code, token }) => ({
                url: "verification/forgottenPassword",
                method: "POST",
                body: code,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postForgotEmailAuth: builder.mutation<AuthResponse, any>({
            query: (email) => ({
                url: "forgottenPassword",
                method: "POST",
                body: email,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotChangePassword: builder.mutation<AuthResponse, any>({
            query: ({ password, token }) => ({
                url: "newPassword",
                method: "POST",
                body: password,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    usePostRegisterCredentialsMutation,
    usePostRegisterCodeMutation,
    usePostForgotCodeMutation,
    usePostResendCodeMutation,
    usePostLoginMutation,
    usePostForgotEmailAuthMutation,
    usePostForgotChangePasswordMutation,
} = Api;
