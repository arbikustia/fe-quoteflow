import * as React from "react";

import { ModalComponent } from "./Modal.component";
import type { ModalProps } from "./Modal.type";

/**
 * Render modal container.
 * @param {ModalProps} props - Modal props
 * @returns {React.ReactElement} Modal container
 */
const ModalContainer = (props: ModalProps): React.ReactElement => <ModalComponent {...props} />;

export default ModalContainer;
