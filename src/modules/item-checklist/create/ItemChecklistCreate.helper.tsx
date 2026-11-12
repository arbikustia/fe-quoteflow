import type { ReactElement } from "react";

import { CheckboxComponent } from "@/components/Checkbox";

import { MOVE_CHECKBOX_CLASS } from "./ItemChecklistCreate.config";
import type { MoveCheckboxProps } from "./ItemChecklistCreate.type";
import { ignoreManualChange, stopClickPropagation } from "./ItemChecklistCreate.util";

/**
 * Render the read-only move checkbox of an item row.
 * @param {MoveCheckboxProps} props - Row, checked ids and label
 * @returns {ReactElement} Move checkbox
 */
export const renderMoveCheckbox = (props: MoveCheckboxProps): ReactElement => (
  <div className="flex items-center justify-center" onClick={stopClickPropagation}>
    <CheckboxComponent
      ariaLabel={`${props.label} ${props.row.itemName}`}
      checked={props.checkedItemIds.includes(props.row.id)}
      onChange={ignoreManualChange}
      disabled
      className={MOVE_CHECKBOX_CLASS}
    />
  </div>
);
