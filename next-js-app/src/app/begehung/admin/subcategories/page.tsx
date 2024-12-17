'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import SubcategoryTable from '@/components/admin/SubcategoryTable';
import SubcategoryModal from '@/components/admin/SubcategoryModal';
import Button from '@/components/Button';
import { Category, SubCategory } from '@/types';

const SubcategoryPage: React.FC = () => {
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Helper to handle Axios errors
    const handleAxiosError = (e: unknown, fallbackMessage: string): string => {
        const error = e as AxiosError<{ error: string }>;
        return error.response?.data?.error || fallbackMessage;
    };

    // Fetch subcategories
    const fetchSubcategories = async () => {
        setError(null);
        try {
            const response = await axios.get('/api/subcategory');
            setSubcategories(response.data.data || []);
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Laden der Unterkategorien.'));
        }
    };

    // Fetch categories for dropdown
    const fetchCategories = async () => {
        setError(null);
        try {
            const response = await axios.get('/api/category');
            setCategories(response.data.data || []);
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Laden der Kategorien.'));
        }
    };

    // Save a subcategory (create or update)
    const saveSubcategory = async (name: string, categoryId: number) => {
        setLoading(true);
        setError(null);
        try {
            if (editingSubcategory) {
                // Update
                await axios.put('/api/subcategory', {
                    id: editingSubcategory.id,
                    name,
                    category: categoryId,
                });
                setSubcategories((prev) =>
                    prev.map((sub) =>
                        sub.id === editingSubcategory.id
                            ? { ...sub, name, category: { ...sub.category, id: categoryId } }
                            : sub
                    )
                );
            } else {
                // Create
                const response = await axios.post('/api/subcategory', {
                    name,
                    category: categoryId,
                });
                setSubcategories((prev) => [...prev, response.data.data[0]]);
            }
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Speichern der Unterkategorie.'));
        } finally {
            fetchSubcategories()
            setModalOpen(false);
            setEditingSubcategory(null);
            setLoading(false);
        }
    };

    // Delete a subcategory
    const deleteSubcategory = async (id: number) => {
        setDeletingId(id);
        setError(null);
        try {
            await axios.delete(`/api/subcategory?id=${id}`);
            setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Löschen der Unterkategorie.'));
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Unterkategorien</h1>

            {/* Error Message */}
            {error && <div className="text-red-500 border border-red-300 p-2 rounded">{error}</div>}

            <Button onClick={() => setModalOpen(true)}>Neue Unterkategorie hinzufügen</Button>

            <SubcategoryTable
                subcategories={subcategories}
                onEdit={(subcategory) => {
                    setEditingSubcategory(subcategory);
                    setModalOpen(true);
                }}
                onDelete={deleteSubcategory}
                deletingId={deletingId}
            />

            <SubcategoryModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingSubcategory(null);
                }}
                onSave={saveSubcategory}
                categories={categories}
                initialName={editingSubcategory?.name || ''}
                initialCategoryId={editingSubcategory?.category?.id || undefined}
                loading={loading}
            />
        </div>
    );
};

export default SubcategoryPage;
