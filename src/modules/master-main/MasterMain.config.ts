import * as React from "react";

import { MASTER_DATA_ITEMS } from "../../components/Sidebar/Sidebar.config";
import type { MasterMainCardProps } from "./MasterMain.type";

export const MASTER_MAIN_CONFIG: readonly MasterMainCardProps[] = MASTER_DATA_ITEMS.map((item) => ({
  title: `Master ${item.name}`,
  description: item.description,
  icon: React.createElement(item.icon),
  path: item.path,
}));
