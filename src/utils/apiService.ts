"use client"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ResCredentialError, ResCredentialSuccess } from "@/components/authPortal/RegisterSection";

const server = "https://powernote-backend-new.vercel.app/api/";

interface Credentials {
    email: string;
    password: string;
}

// Define a service using a base URL and expected endpoints
export const Api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: server }),
    endpoints: (builder) => ({
        postRegisterCredentials: builder.mutation<ResCredentialSuccess, any>({
            query: (credentials) => ({
                url: "auth/register",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postRegisterCode: builder.mutation({
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
        postResendCode: builder.mutation({
            query: ({ token }) => ({
                url: "verification/resendCode",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postLogin: builder.mutation<ResCredentialSuccess, Credentials>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotCode: builder.mutation({
            query: ({ code, token }) => ({
                url: "verification/forgot",
                method: "POST",
                body: code,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postForgotEmailAuth: builder.mutation({
            query: (email) => ({
                url: "auth/forgot/emailAuth",
                method: "POST",
                body: email,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotChangePassword: builder.mutation({
            query: ({ password, token }) => ({
                url: "auth/forgot/changePassword",
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
