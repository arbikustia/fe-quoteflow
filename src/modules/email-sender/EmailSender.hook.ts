import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetEmailSendersQuery } from "@/services/email-sender.service";

import type { EmailSender } from "./EmailSender.type";

export const useEmailSender = (): { rows: EmailSender[]; loading: boolean; page: number; totalPages: number; totalCount: number; setSearch: (value: string) => void; setPage: (page: number) => void; create: () => void; edit: (row: EmailSender) => void; back: () => void } => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearchState] = useState("");
  const query = useGetEmailSendersQuery({ pageNumber: page, pageSize: 10, searchTerm: search });
  return {
    rows: query.data?.data ?? [],
    loading: query.isLoading,
    page,
    totalPages: query.data?.total_pages ?? 0,
    totalCount: query.data?.total_count ?? 0,
    setSearch: (value: string): void => { setSearchState(value); setPage(1); },
    setPage,
    create: (): void => { navigate("/master-email-sender/create"); },
    edit: (row: EmailSender): void => { navigate(`/master-email-sender/edit/${row.id}`, { state: { emailSender: row } }); },
    back: (): void => { navigate(-1); },
  };
};
