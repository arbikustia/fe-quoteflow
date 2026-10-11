import * as React from "react";

import { ConfirmModalComponent } from "./ConfirmModal.component";
import { useConfirmModal } from "./ConfirmModal.hook";
import type { ConfirmModalProps } from "./ConfirmModal.type";

/**
 * Render confirmation dialog container
 * @param {ConfirmModalProps} props - confirmation props
 * @returns {React.ReactElement | null} - confirmation dialog container
 */
const ConfirmModalContainer = (props: ConfirmModalProps): React.ReactElement | null => {
  const confirmationState = useConfirmModal(props);

  return <ConfirmModalComponent {...props} {...confirmationState} />;
};

export default ConfirmModalContainer;
