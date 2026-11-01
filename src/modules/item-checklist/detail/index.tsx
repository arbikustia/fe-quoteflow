import type { ReactElement } from "react";

import { ItemChecklistDetailComponent } from "./ItemChecklistDetail.component";
import { useItemChecklistDetail } from "./ItemChecklistDetail.hook";

/** Render item checklist detail container. */
const ItemChecklistDetail = (): ReactElement => {
  const detailState = useItemChecklistDetail();
  return <ItemChecklistDetailComponent {...detailState} />;
};

export default ItemChecklistDetail;
