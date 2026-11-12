import * as React from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import MasterEmailSenderComponent from "./MasterEmailSender.component";
import { MASTER_EMAIL_SENDER_ROUTE } from "./MasterEmailSender.config";
import { useMasterEmailSender } from "./MasterEmailSender.hook";
import type { EmailSenderRouteState } from "./MasterEmailSender.type";
import { normalizeEmailSenderList } from "./MasterEmailSender.util";

import { useGetEmailSendersQuery } from "@/services/email-sender.service";

/**
 * Render the email sender list container.
 * @returns {React.ReactElement} - Container of the email sender list view
 */
const MasterEmailSenderContainer = (): React.ReactElement => {
  const location = useLocation();
  const routeState: EmailSenderRouteState = location.state;
  const { canCreate, canEdit } = usePagePermission(MASTER_EMAIL_SENDER_ROUTE.LIST);
  const controller = useMasterEmailSender();
  const { data, isLoading, isError } = useGetEmailSendersQuery(controller.queryParams);

  // Single upstream fallback: the view receives normalized data only
  const listView = normalizeEmailSenderList({ data, isLoading, isError });

  return (
    <MasterEmailSenderComponent
      {...listView}
      currentPage={controller.currentPage}
      pageSize={controller.pageSize}
      canCreate={canCreate}
      canEdit={canEdit}
      successMessage={routeState?.successMessage}
      onPageChange={controller.handlePageChange}
      onPageSizeChange={controller.handlePageSizeChange}
      onSearchChange={controller.handleSearchChange}
      onBack={controller.handleBack}
      onCreate={controller.handleCreate}
      onEdit={controller.handleEdit}
    />
  );
};

export default MasterEmailSenderContainer;
