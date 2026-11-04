import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { NoteApiRecord, NoteCreatePayload, NoteDeletePayload, NoteListResponse, NoteResponse, NoteUpdatePayload } from "@/modules/note/Note.type";

const NOTE_TAG = "Note";

const _mapNote = (note: NoteApiRecord): NoteApiRecord => note;

export const noteService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<NoteListResponse, void>({
      query: () => ({ url: ENDPOINT.NOTE.ALL, method: "GET" }),
      transformResponse: (response: NoteListResponse): NoteListResponse => ({
        ...response,
        data: response.data.map(_mapNote),
      }),
      providesTags: [NOTE_TAG],
    }),
    createNote: builder.mutation<NoteResponse, NoteCreatePayload>({
      query: (payload) => ({
        url: ENDPOINT.NOTE.CREATE,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [NOTE_TAG],
    }),
    updateNote: builder.mutation<NoteResponse, NoteUpdatePayload>({
      query: (payload) => ({
        url: `${ENDPOINT.NOTE.CREATE}/${payload.id}`,
        method: "PUT",
        params: { id: payload.id },
        data: {
          content: payload.content,
          status: payload.status,
        },
      }),
      invalidatesTags: [NOTE_TAG],
    }),
    deleteNote: builder.mutation<NoteResponse, NoteDeletePayload>({
      query: (payload) => ({
        url: `${ENDPOINT.NOTE.CREATE}/${payload.id}`,
        method: "DELETE",
        params: { id: payload.id },
      }),
      invalidatesTags: [NOTE_TAG],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = noteService;
