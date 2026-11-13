import type { ReactElement } from "react";

import { usePagePermission } from "@/hooks/usePagePermission";

import { ItemReturnComponent } from "./ItemReturn.component";
import { useItemReturnState } from "./ItemReturn.hook";

/**
 * Item return list container: permission gate and state mapping.
 * @returns {ReactElement | null} Item return list page, or null without view permission
 */
const ItemReturnContainer = (): ReactElement | null => {
  const { canView } = usePagePermission("/item-return");
  const state = useItemReturnState();

  if (!canView) {
    return null;
  }

  return <ItemReturnComponent {...state} />;
};

export default ItemReturnContainer;
