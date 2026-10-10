// Abstrekkt Design System — Table.tsx
import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface TableProps<T extends { id: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  caption?: string;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
  selectedRows?: Set<number>;
  onSelectRow?: (index: number) => void;
  emptyMessage?: string;
}

function Table<T extends { id: string | number }>({
  columns,
  data,
  caption,
  onSort,
  isLoading = false,
  selectedRows = new Set(),
  onSelectRow,
  emptyMessage = 'No data available.',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const colSpan = columns.length + (onSelectRow ? 1 : 0);

  const handleSort = (key: keyof T) => {
    const next = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(next);
    onSort?.(key, next);
  };

  return (
    <div className="overflow-x-auto border border-neutral-300 rounded-lg">
      <table className="w-full border-collapse font-body text-sm" role="table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-300">
            {onSelectRow && (
              <th scope="col" className="px-4 py-3 text-left w-10">
                <span className="sr-only">Select</span>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className="px-4 py-3 text-left text-neutral-900 font-semi"
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 hover:text-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 rounded-sm"
                    aria-sort={sortKey === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    {col.header}
                    <span className="text-neutral-400" aria-hidden="true">
                      {sortKey === col.key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr role="row">
              <td colSpan={colSpan} className="px-4 py-8 text-center text-neutral-500" role="status" aria-live="polite">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr role="row">
              <td colSpan={colSpan} className="px-4 py-12 text-center text-neutral-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id}
                role="row"
                aria-selected={onSelectRow ? selectedRows.has(index) : undefined}
                className={classNames(
                  'border-b border-neutral-200 transition-colors duration-fast',
                  selectedRows.has(index) ? 'bg-primary-50' : 'hover:bg-neutral-50'
                )}
              >
                {onSelectRow && (
                  <td className="px-4 py-3" role="cell">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => onSelectRow(index)}
                      aria-label={`Select row ${index + 1}`}
                      className="rounded-sm border-neutral-300 text-primary-400 focus:ring-primary-400"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-neutral-900" role="cell">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
export type { TableProps, TableColumn };
