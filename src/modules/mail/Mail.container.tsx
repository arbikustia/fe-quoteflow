import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import { AlertComponent } from "@/components/Alert";

import { MailComponent } from "./Mail.component";
import { useMailNavigation, useMailPagination } from "./Mail.hook";
import type { MailRouteState } from "./Mail.type";

/**
 * Mail Container
 * @returns {ReactElement | null} Container element
 */
const MailContainer = (): ReactElement | null => {
  const location = useLocation();
  const routeState: MailRouteState | undefined = location.state;
  const { goBack, goCompose } = useMailNavigation();
  const pagination = useMailPagination();
  const { canView } = usePagePermission("/mail");

  if (!canView) {
    return null;
  }

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MailComponent {...pagination} onBack={goBack} onCompose={goCompose} />
    </>
  );
};

export default MailContainer;
