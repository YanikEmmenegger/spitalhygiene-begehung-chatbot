'use client';

import React from 'react';
import Button from '@/components/Button';
import ConfirmDelete from '@/components/ConfirmDelete';
import {Category} from "@/types";



interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
    deletingId: number | null;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete, deletingId }) => {
    return (
        <div className="overflow-x-auto rounded-md shadow-md border border-gray-200">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-center"></th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-100">
                        <td className="border p-2">{category.name}</td>
                        <td className="border p-2 text-center">
                            <div className="flex gap-2 justify-end">
                                <Button
                                    onClick={() => onEdit(category)}
                                >
                                    Bearbeiten
                                </Button>
                                <ConfirmDelete
                                    onDelete={() => onDelete(category.id)}
                                    text={deletingId === category.id ? 'Löschen...' : 'Löschen'}
                                    confirmText="Bestätigen"
                                    disabled={deletingId === category.id}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryTable;
