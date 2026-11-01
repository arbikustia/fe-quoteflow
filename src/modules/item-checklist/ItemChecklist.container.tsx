import type { ReactElement } from "react";

import { ItemChecklistComponent } from "./ItemChecklist.component";
import { useItemChecklistState } from "./ItemChecklist.hook";

const ItemChecklistContainer = (): ReactElement => <ItemChecklistComponent {...useItemChecklistState()} />;

export default ItemChecklistContainer;
