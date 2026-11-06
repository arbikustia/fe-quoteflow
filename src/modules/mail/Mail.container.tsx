import type { ReactElement } from "react";
import { useLocation } from "react-router-dom";

import { MailComponent } from "./Mail.component";
import { useMailNavigation, useMailPagination } from "./Mail.hook";
import type { MailRouteState } from "./Mail.type";
import { AlertComponent } from "../../components/Alert";

/**
 * Mail Container
 * @returns {ReactElement} Container element
 */
const MailContainer = (): ReactElement => {
  const location = useLocation();
  const routeState: MailRouteState | undefined = location.state;
  const { goBack, goCompose } = useMailNavigation();
  const pagination = useMailPagination();

  return (
    <>
      {routeState?.successMessage && <AlertComponent type="success" message={routeState.successMessage} toast closable />}
      <MailComponent {...pagination} onBack={goBack} onCompose={goCompose} />
    </>
  );
};

export default MailContainer;
