'use client';

// Import React and types for defining props
import React, { ReactNode } from 'react';

// Interface for defining a column in the table
interface ColumnDefinition<T> {
    header: string; // Column header text
    accessor: keyof T | ((item: T) => ReactNode); // Accessor to retrieve or compute cell content
    isAction?: boolean; // Optional flag for action columns
}

// Interface for table props
interface TableProps<T> {
    data: T[]; // Array of data to display in the table
    columns: ColumnDefinition<T>[]; // List of column definitions
    actions?: (item: T) => ReactNode; // Optional callback to render actions for each row
    emptyMessage?: string; // Message to display when no data is available
    loading?: boolean; // Indicates if data is being loaded
    skeletonRowCount?: number; // Number of skeleton rows to display during loading
}

// Generic table component
const Table = <T,>({
                       data,
                       columns,
                       actions,
                       emptyMessage = 'Keine Daten verfügbar.', // Default empty message
                       loading = false, // Default loading state
                       skeletonRowCount = 5, // Default skeleton row count
                   }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto rounded-md shadow-md border border-gray-200">
            <table className="min-w-full table-auto">
                <thead>
                <tr className="bg-gray-100">
                    {columns.map((column, index) => (
                        <th key={index} className="p-3 border-b text-left">
                            {column.header}
                        </th>
                    ))}
                    {actions && <th className="p-3 border-b text-center">Aktionen</th>}
                </tr>
                </thead>
                <tbody>
                {/* Render skeleton rows if loading */}
                {loading ? (
                    Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((_, colIndex) => (
                                <td key={colIndex} className="p-3 border-b">
                                    <div className="animate-pulse bg-gray-300 h-4 w-3/4 rounded-md"></div>
                                </td>
                            ))}
                            {actions && (
                                <td className="p-3 border-b">
                                    <div className="animate-pulse bg-gray-300 h-4 w-1/4 rounded-md"></div>
                                </td>
                            )}
                        </tr>
                    ))
                ) : data.length > 0 ? (
                    // Render table rows with data
                    data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="p-3 border-b">
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item) // Compute cell content using callback
                                        : (item[column.accessor] as ReactNode)}
                                </td>
                            ))}
                            {actions && (
                                <td className="p-3 border-b text-center">
                                    {actions(item)}
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    // Render empty message if no data
                    <tr>
                        <td
                            colSpan={columns.length + (actions ? 1 : 0)}
                            className="p-3 border-b text-center text-gray-500"
                        >
                            {emptyMessage}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Table; // Export the Table component for use in other parts of the application
