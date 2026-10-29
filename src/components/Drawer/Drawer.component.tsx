import type { ReactElement } from "react";
import { Drawer as AntDrawer } from "antd";

import type { DrawerProps } from "./Drawer.type";

/**
 * Render reusable application drawer.
 * @param {DrawerProps} props - Drawer configuration
 * @returns {ReactElement} Drawer element
 */
export const DrawerComponent = (props: DrawerProps): ReactElement => {
  const {
    children,
    height,
    isOpen,
    onClose,
    placement = "bottom",
    title,
    width,
  } = props;

  return (
    <AntDrawer
      open={isOpen}
      onClose={onClose}
      placement={placement}
      title={title}
      height={height}
      width={width}
      classNames={{ body: "!bg-background-surface !p-4", header: "!border-border-default !bg-background-surface" }}
      styles={{ wrapper: { maxWidth: "100%" } }}
    >
      {children}
    </AntDrawer>
  );
};
