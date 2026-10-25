import type { ReactElement } from "react";
import { Alert as AntAlert } from "antd";

import { useAlertToast } from "./Alert.hook";
import type { AlertProps } from "./Alert.type";

/**
 * Render reusable Ant Design alert.
 * @param {AlertProps} props - Alert content and behavior
 * @returns {ReactElement} Alert component
 */
export const AlertComponent = (props: AlertProps): ReactElement => {
  const { type = "info", message, description, closable = false, onClose, className = "", toast = false } = props;
  const { isVisible, closeToast } = useAlertToast(toast, onClose);
  const alert = (
    <AntAlert
      className={className}
      closable={closable || toast ? { onClose: closeToast } : false}
      description={description}
      showIcon
      title={message}
      type={type}
    />
  );

  if (!isVisible) {
    return <></>;
  }

  if (!toast) {
    return alert;
  }

  return <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-md shadow-lg">{alert}</div>;
};

export default AlertComponent;
