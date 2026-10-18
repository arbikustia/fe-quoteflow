import * as React from "react";

import { ConfirmModalComponent } from "./ConfirmModal.component";
import type { ConfirmModalProps } from "./ConfirmModal.type";

/**
 * Render confirmation modal container.
 * @param {ConfirmModalProps} props - Confirmation modal props
 * @returns {React.ReactElement} Confirmation modal container
 */
const ConfirmModalContainer = (props: ConfirmModalProps): React.ReactElement => <ConfirmModalComponent {...props} />;

export default ConfirmModalContainer;
