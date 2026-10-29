import * as React from "react";
import { Outlet } from "react-router-dom";

import MobileNavigate from "../../components/MobileNavigate";

export default function MobileLayout({ children }: { children?: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex flex-col h-full w-full bg-background-surface absolute inset-0">
      <div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden pb-24 bg-background-surface">
        {children || <Outlet />}
      </div>
      <MobileNavigate />
    </div>
  );
}
