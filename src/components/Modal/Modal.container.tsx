import * as React from "react";
import { ModalComponent } from "./Modal.component";
import type { ModalProps } from "./Modal.type";

const ModalContainer = (props: ModalProps): React.ReactElement => {
  return <ModalComponent {...props} />;
};

export default ModalContainer;
