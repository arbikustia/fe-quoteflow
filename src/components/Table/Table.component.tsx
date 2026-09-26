import React from "react";
import type { TableProps } from "./Table.type";

export const TableComponent = <T,>(
  props: TableProps<T>
): React.ReactElement => {
  const { data, columns, keyExtractor } = props;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="bg-brand-gray-light border-b border-gray-100">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 font-medium">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyExtractor ? keyExtractor(row) : index} className="hover:bg-gray-50/50 transition-colors group">
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-6 py-4 border-b border-gray-100 ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
