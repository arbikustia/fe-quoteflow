import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { EmailSender, EmailSenderListState, EmailSenderRouteState } from "./EmailSender.type";

import { useGetEmailSendersQuery } from "@/services/email-sender.service";

/**
 * Build the navigation actions for the sender list.
 *
 * @param {(path: string, options?: { state?: EmailSenderRouteState }) => void} navigate - Router navigate
 * @returns {Pick<EmailSenderListState, "create" | "edit" | "back">} Navigation actions
 */
const _buildNavigation = (
  navigate: (path: string, options?: { state?: EmailSenderRouteState }) => void,
): Pick<EmailSenderListState, "create" | "edit" | "back"> => {
  /**
   * Navigate to the create form.
   *
   * @returns {void} No return value
   */
  const create = (): void => {
    navigate("/master-email-sender/create");
  };

  /**
   * Navigate to the edit form for a sender.
   *
   * @param {EmailSender} row - Sender row
   * @returns {void} No return value
   */
  const edit = (row: EmailSender): void => {
    navigate(`/master-email-sender/edit/${row.id}`, { state: { emailSender: row } });
  };

  /**
   * Navigate back to the master menu.
   *
   * @returns {void} No return value
   */
  const back = (): void => {
    navigate("/master-main");
  };

  return { create, edit, back };
};

/**
 * Provide the email sender list state and actions.
 *
 * @returns {EmailSenderListState} List state and handlers
 */
export const useEmailSender = (): EmailSenderListState => {
  const navigate = useNavigate();
  const routeState: EmailSenderRouteState | null = useLocation().state;
  const [page, setPage] = useState(1);
  const [search, setSearchState] = useState("");
  const query = useGetEmailSendersQuery({ pageNumber: page, pageSize: 10, searchTerm: search });
  const data = query.data;
  const navigation = _buildNavigation(navigate);

  /**
   * Update the search term and reset to the first page.
   *
   * @param {string} value - Search term
   * @returns {void} No return value
   */
  const setSearch = (value: string): void => {
    setSearchState(value);
    setPage(1);
  };

  const successMessage = routeState?.successMessage ?? null;

  if (!data) {
    return { rows: [], loading: query.isLoading, page, totalPages: 0, totalCount: 0, successMessage, setSearch, setPage, ...navigation };
  }

  return {
    rows: data.data,
    loading: query.isLoading,
    page,
    totalPages: data.total_pages,
    totalCount: data.total_count,
    successMessage,
    setSearch,
    setPage,
    ...navigation,
  };
};
