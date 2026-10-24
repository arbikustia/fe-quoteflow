import type { ReactElement } from "react";
import { Alert as AntAlert } from "antd";

import type { AlertProps } from "./Alert.type";

/**
 * Render reusable Ant Design alert.
 * @param {AlertProps} props - Alert content and behavior
 * @returns {ReactElement} Alert component
 */
export const AlertComponent = ({ type = "info", message, description, closable = false, onClose, className = "" }: AlertProps): ReactElement => (
  <AntAlert
    className={className}
    closable={closable ? { onClose } : false}
    description={description}
    showIcon
    title={message}
    type={type}
  />
);

export default AlertComponent;
