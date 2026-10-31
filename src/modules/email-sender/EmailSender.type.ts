import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

export type EmailSender = { id: string; name: string; email: string; smtp_host: string; smtp_port: number; smtp_username: string; enable_ssl: boolean; is_default: boolean; status: number; created_at: string; updated_at: string };
export type EmailSenderPayload = Omit<EmailSender, "id" | "created_at" | "updated_at">;
export type EmailSenderListParams = { pageNumber: number; pageSize: number; searchTerm: string };
export type EmailSenderListResponse = PaginatedResponse<EmailSender>;
export type EmailSenderAllResponse = ApiEnvelope<EmailSender[]>;
export type EmailSenderMutationResponse = ApiEnvelope<EmailSender | null>;
export type EmailSenderFormState = { id?: string; name: string; email: string; smtp_host: string; smtp_port: number; smtp_username: string; smtp_password: string; enable_ssl: boolean; is_default: boolean; status: number };
