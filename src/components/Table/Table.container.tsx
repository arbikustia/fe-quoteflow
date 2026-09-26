import * as React from "react";
import { TableComponent } from "./Table.component";
import type { TableProps } from "./Table.type";

const TableContainer = <T,>(props: TableProps<T>): React.ReactElement => {
  return <TableComponent {...props} />;
};

export default TableContainer;
