import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { usePagePermission } from "@/hooks/usePagePermission";

import { ItemReturnComponent } from "./ItemReturn.component";
import { useItemReturnState } from "./ItemReturn.hook";

const ItemReturnContainer = (): ReactElement | null => {
  const { canView } = usePagePermission("/item-return");
  if (!canView) return null;
  return <ItemReturnComponent {...useItemReturnState()} />;
};

export default ItemReturnContainer;
