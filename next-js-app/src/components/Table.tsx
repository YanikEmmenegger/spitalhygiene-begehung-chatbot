'use client';

import React, { ReactNode } from 'react';

interface ColumnDefinition<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    isAction?: boolean;
}

interface TableProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    actions?: (item: T) => ReactNode;
    emptyMessage?: string;
    loading?: boolean;
    skeletonRowCount?: number;
}

const Table = <T,>({
                       data,
                       columns,
                       actions,
                       emptyMessage = 'Keine Daten verfügbar.',
                       loading = false,
                       skeletonRowCount = 5,
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
                    data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="p-3 border-b">
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(item)
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

export default Table;
