import * as React from "react";

import { TableComponent } from "./Table.component";
import type { TableProps } from "./Table.type";

/**
 * Render table container.
 * @param {TableProps<T>} props - Table props
 * @returns {React.ReactElement} Table container
 */
const TableContainer = <T,>(props: TableProps<T>): React.ReactElement => <TableComponent {...props} />;

export default TableContainer;
