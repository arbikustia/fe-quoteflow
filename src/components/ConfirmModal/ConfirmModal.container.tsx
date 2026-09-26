import * as React from "react";
import { ConfirmModalComponent } from "./ConfirmModal.component";
import type { ConfirmModalProps } from "./ConfirmModal.type";

const ConfirmModalContainer = (props: ConfirmModalProps): React.ReactElement => {
  return <ConfirmModalComponent {...props} />;
};

export default ConfirmModalContainer;
