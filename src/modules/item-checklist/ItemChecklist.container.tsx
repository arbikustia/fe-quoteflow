import type { ReactElement } from "react";

import { ItemChecklistComponent } from "./ItemChecklist.component";
import { useItemChecklistState } from "./ItemChecklist.hook";

/**
 * Render Item Checklist container.
 * @returns {ReactElement} Item Checklist container element
 */
const ItemChecklistContainer = (): ReactElement => {
  const state = useItemChecklistState();

  return <ItemChecklistComponent {...state} />;
};

export default ItemChecklistContainer;
