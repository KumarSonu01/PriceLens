import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";

const DataTable = ({
  columns = [],
  data = [],
  keyField = "_id",
  density = "comfortable", // 'comfortable' | 'compact'
  emptyMessage = "No records found",
  className,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    const result = aVal > bVal ? 1 : -1;
    return sortDirection === "asc" ? result : -result;
  });

  const paddingY = density === "compact" ? "py-2.5 px-3.5" : "py-3.5 px-4";

  return (
    <div
      className={cn(
        "w-full overflow-hidden border border-line rounded-lg bg-surface shadow-xs",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text border-collapse">
          <thead className="bg-surface-2 text-xs font-semibold uppercase tracking-wider text-muted border-b border-line sticky top-0 z-10 select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  scope="col"
                  className={cn(
                    paddingY,
                    col.sortable && "cursor-pointer hover:text-text",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      col.align === "right" && "justify-end flex-row-reverse"
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-muted/60">
                        {sortField === col.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="w-3.5 h-3.5 text-signal" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-signal" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row[keyField] || rowIndex}
                  className="hover:bg-surface-2/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.header}
                      className={cn(
                        paddingY,
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.cellClassName
                      )}
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
