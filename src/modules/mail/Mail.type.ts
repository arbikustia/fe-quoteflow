import type { ApiMessages, PaginatedResponse } from "@/types/api.type";
import type { ActiveStatus } from "@/types/common.type";

export type ApiMail = {
  id: string;
  recipient: string;
  subject: string;
  body?: string;
  status: number;
  created_at?: string;
  created_by?: string;
};

export type MailListResponse = PaginatedResponse<ApiMail>;

export type MailListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type MailSendResponse = {
  status: boolean;
  messages?: ApiMessages;
};

export type MailData = {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  status: ActiveStatus;
  createAt: string;
  createBy: string;
};

export type MailMobileCardProps = {
  mail: MailData;
};

export type MailListApiState = {
  isLoading: boolean;
  errorMessage?: string;
  isMissingData: boolean;
  paginatedData: MailData[];
  totalPages: number;
  totalCount: number;
};

export type MailNavigation = {
  goBack: () => void;
  goCompose: () => void;
};

export type MailPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: MailData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MailProps = MailPagination & {
  onCompose: () => void;
  onBack: () => void;
};

export type MailRouteState = {
  successMessage?: string;
};

export type MailTemplate = "quotation" | "invoice";

export type MailTemplateContent = {
  eyebrow: string;
  heading: string;
  accent: string;
  intro: string;
  note: string;
  closing: string;
};

export type EmailSenderListItem = {
  id: string;
  name: string;
  email: string;
};

export type EmailSenderListResponse = {
  status: boolean;
  data: EmailSenderListItem[];
  messages?: ApiMessages;
};
