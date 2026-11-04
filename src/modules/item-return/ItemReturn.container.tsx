import type { ReactElement } from "react";

import { ItemReturnComponent } from "./ItemReturn.component";
import { useItemReturnState } from "./ItemReturn.hook";

const ItemReturnContainer = (): ReactElement => <ItemReturnComponent {...useItemReturnState()} />;

export default ItemReturnContainer;
