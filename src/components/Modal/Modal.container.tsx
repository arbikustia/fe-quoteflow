import * as React from "react";

import { ModalComponent } from "./Modal.component";
import { useModal } from "./Modal.hook";
import type { ModalProps } from "./Modal.type";

/**
 * Render Modal Container
 * @param {ModalProps} props - modal props
 * @returns {React.ReactElement} - ModalContainer element
 */
const ModalContainer = (props: ModalProps): React.ReactElement => {
  const modalAccessibility = useModal(props);

  return <ModalComponent {...props} {...modalAccessibility} />;
};

export default ModalContainer;
