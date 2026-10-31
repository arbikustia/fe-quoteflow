import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { NoteApiRecord, NoteCreatePayload, NoteListResponse, NoteResponse } from "@/modules/note/Note.type";

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
  }),
  overrideExisting: false,
});

export const { useGetNotesQuery, useCreateNoteMutation } = noteService;
