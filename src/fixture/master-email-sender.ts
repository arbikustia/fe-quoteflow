import type { ApiEmailSender, EmailSenderListResponse } from "@/modules/master-data/master-email-sender/MasterEmailSender.type";

export const MOCK_API_EMAIL_SENDERS: ApiEmailSender[] = [
  {
    id: "sender-1",
    name: "Finance Sender",
    email: "finance@company.com",
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_username: "finance",
    enable_ssl: true,
    is_default: true,
    status: 1,
    created_at: "2026-11-04 23:04:28",
    updated_at: "2026-11-04 23:04:28",
  },
  {
    id: "sender-2",
    name: "Support Sender",
    email: "support@company.com",
    smtp_host: "mail.company.com",
    smtp_port: 465,
    smtp_username: "support",
    enable_ssl: false,
    is_default: false,
    status: 0,
    created_at: null,
    updated_at: null,
  },
];

export const MOCK_EMAIL_SENDER_LIST_RESPONSE: EmailSenderListResponse = {
  data: MOCK_API_EMAIL_SENDERS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_EMAIL_SENDERS.length,
  has_previous: false,
  has_next: false,
};
