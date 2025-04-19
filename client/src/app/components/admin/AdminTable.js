// src/components/admin/AdminTable.js
import { Table, Thead, Tbody, Tr, Th, Td } from '@/app/components/ui/Table';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AdminTable({ columns, data, emptyMessage = "No data available" }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--border)]">
        <thead className="bg-[var(--card)]">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--card)] divide-y divide-[var(--border)]">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[var(--card-hover)] transition-colors">
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.accessor}`}
                    className="px-6 py-4 whitespace-nowrap"
                  >
                    {column.cell 
                      ? column.cell(row[column.accessor], row) 
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-[var(--muted)]">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="bg-[var(--card)] px-4 py-3 flex items-center justify-between border-t border-[var(--border)] sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="pagination-button">
              Previous
            </button>
            <button className="pagination-button">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[var(--muted)]">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{data.length}</span> of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted)] hover:bg-[var(--card-hover)]">
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  aria-current="page"
                  className="z-10 bg-[var(--primary)] bg-opacity-10 border-[var(--primary)] text-[var(--primary)] relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </button>
                <button className="bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card-hover)] relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card-hover)] relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border)] bg-[var(--card)] text-sm font-medium text-[var(--muted)] hover:bg-[var(--card-hover)]">
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}