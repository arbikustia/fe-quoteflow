import React from "react";

import type { TableProps } from "./Table.type";

const getAlignClass = (align?: "left" | "right" | "center"): string => {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
};

/**
 * Render Table Component
 * @param {TableProps<T>} props - props
 * @returns {React.ReactElement} element
 */
export const TableComponent = <T,>(
  props: TableProps<T>
): React.ReactElement => {
  const { data, columns, keyExtractor } = props;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead>
          <tr className="bg-brand-gray-light border-b border-brand-gray-light">
            {columns.map((col) => (
              <th 
                key={col.key} 
                className={`px-6 py-4 text-xs font-bold text-brand-text-medium uppercase tracking-wider ${getAlignClass(col.align)}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-light">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-brand-text-medium font-medium">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={keyExtractor ? keyExtractor(row) : index} className="hover:bg-brand-gray-light/50 transition-colors group">
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`px-6 py-4 border-b border-brand-gray-light ${getAlignClass(col.align)}`}
                  >
                    {col.render ? col.render(row, index) : (row as Record<string, React.ReactNode>)[col.key]}
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
