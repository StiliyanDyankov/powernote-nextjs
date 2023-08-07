import { Note, Topic } from '@/utils/notesDb';
"use client"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthResponse, ResCredentialError, ResCredentialSuccess } from "@/components/authPortal/RegisterSection";

const server = "http://localhost:8081/api/v1/";

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
                url: "auth/register",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postRegisterCode: builder.mutation<AuthResponse, any>({
            query: ({ code, token }) => ({
                url: "auth/verification/register",
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
                url: "auth/verification/newCode",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        postLogin: builder.mutation<AuthResponse, any>({
            query: (credentials) => ({
                url: "auth/authenticate",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotCode: builder.mutation<AuthResponse, any>({
            query: ({ code, token }) => ({
                url: "auth/verification/forgottenPassword",
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
                url: "auth/forgottenPassword",
                method: "POST",
                body: email,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        postForgotChangePassword: builder.mutation<AuthResponse, any>({
            query: ({ password, token }) => ({
                url: "auth/newPassword",
                method: "POST",
                body: password,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            }),
        }),
        createNewNote: builder.mutation<any, { note: Note, token: { token: string } }>({
            query: ({note, token}) => ({
                url: "app/note",
                method: "POST", 
                body: note,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        updateNoteMetadata: builder.mutation<any, { note: Note, token: { token: string } }>({
            query: ({note, token}) => ({
                url: `app/note/${note.id}?field=metadata`,
                method: "PATCH", 
                body: note,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        updateNoteContent: builder.mutation<any, { note: Note, token: { token: string } }>({
            query: ({note, token}) => ({
                url: `app/note/${note.id}?field=content`,
                method: "PATCH", 
                body: note,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        deleteNote: builder.mutation<any, { noteId: string, token: { token: string } }>({
            query: ({noteId, token}) => ({
                url: `app/note/${noteId}`,
                method: "DELETE", 
                body: {},
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        deleteTopic: builder.mutation<any, { topicId: string, token: { token: string } }>({
            query: ({topicId, token}) => ({
                url: `app/topic/${topicId}`,
                method: "DELETE", 
                body: {},
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        createNewTopic: builder.mutation<any, { topic: Topic, token: { token: string } }>({
            query: ({topic, token}) => ({
                url: "app/topic",
                method: "POST", 
                body: topic,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
        }),
        updateTopic: builder.mutation<any, { topic: Topic, token: { token: string } }>({
            query: ({topic, token}) => ({
                url: "app/topic",
                method: "PATCH", 
                body: topic,
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token.token}`,
                },
            })
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
    useCreateNewNoteMutation,
    useUpdateNoteMetadataMutation,
    useCreateNewTopicMutation,
    useUpdateTopicMutation,
    useDeleteNoteMutation,
    useDeleteTopicMutation,
    useUpdateNoteContentMutation
} = Api;
