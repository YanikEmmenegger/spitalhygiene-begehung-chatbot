'use client';

import React from 'react';
import Button from '@/components/Button';
import { SubCategory } from '@/types';

interface SubcategoryTableProps {
    subcategories: SubCategory[];
    onEdit: (subcategory: SubCategory) => void;
    onDelete: (id: number) => void;
    deletingId: number | null;
}

const SubcategoryTable: React.FC<SubcategoryTableProps> = ({
                                                               subcategories,
                                                               onEdit,
                                                               onDelete,
                                                               deletingId,
                                                           }) => {
    return (
        <div className="overflow-x-auto rounded-md shadow-md border border-gray-200">
            <table className="min-w-full table-auto">
                <thead>
                <tr className="bg-gray-100">
                    <th className="p-3 border-b text-left">Name</th>
                    <th className="p-3 border-b text-left">Kategorie</th>
                    <th className="p-3 border-b text-center"></th>
                </tr>
                </thead>
                <tbody>
                {subcategories.length > 0 ? (
                    subcategories.map((subcategory) => (
                        <tr key={subcategory.id} className="hover:bg-gray-50">
                            {/* Subcategory Name */}
                            <td className="p-3 border-b">{subcategory.name}</td>

                            {/* Category Name */}
                            <td className="p-3 border-b">{subcategory.category.name}</td>

                            {/* Actions */}
                            <td className="p-3 border-b text-center">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => onEdit(subcategory)}
                                    >
                                        Bearbeiten
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(subcategory.id)}
                                        disabled={deletingId === subcategory.id}
                                        className="bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        {deletingId === subcategory.id
                                            ? 'Löschen...'
                                            : 'Löschen'}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={3}
                            className="p-3 border-b text-center text-gray-500"
                        >
                            Keine Unterkategorien verfügbar.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default SubcategoryTable
