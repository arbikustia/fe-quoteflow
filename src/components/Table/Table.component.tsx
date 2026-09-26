import * as React from "react";
import type { TableProps } from "./Table.type";

export const TableComponent = <T,>(props: TableProps<T>): React.ReactElement => {
  const { data, columns, keyExtractor } = props;

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50">
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
        <tbody className="divide-y divide-gray-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400 font-medium">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-6 py-4 ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
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
