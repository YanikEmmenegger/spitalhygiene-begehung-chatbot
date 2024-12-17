'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import CategoryTable from '@/components/admin/CategoryTable';
import CategoryModal from '@/components/admin/CategoryModal';
import Button from '@/components/Button';
import { Category } from '@/types';

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Helper to handle Axios errors
    const handleAxiosError = (e: unknown, fallbackMessage: string): string => {
        const error = e as AxiosError<{ error: string }>;
        return error.response?.data?.error || fallbackMessage;
    };

    // Fetch all categories
    const fetchCategories = async () => {
        setError(null);
        try {
            const response = await axios.get('/api/category');
            setCategories(response.data.data || []);
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Laden der Kategorien.'));
        }
    };

    // Save a category (create or update)
    const saveCategory = async (name: string) => {
        setLoading(true);
        setError(null);
        try {
            if (editingCategory) {
                // Update
                await axios.put('/api/category', { id: editingCategory.id, name });
                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.id === editingCategory.id ? { ...cat, name } : cat
                    )
                );
            } else {
                // Create
                const response = await axios.post('/api/category', { name });
                setCategories((prev) => [...prev, response.data.data[0]]);
            }
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Speichern der Kategorie.'));
        } finally {
            setModalOpen(false);
            setEditingCategory(null);
            setLoading(false);
        }
    };

    // Delete a category
    const deleteCategory = async (id: number) => {
        setDeletingId(id);
        setError(null);
        try {
            await axios.delete(`/api/category?id=${id}`);
            setCategories((prev) => prev.filter((category) => category.id !== id));
        } catch (e) {
            setError(handleAxiosError(e, 'Fehler beim Löschen der Kategorie.'));
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Kategorien</h1>

            {/* Error Message */}
            {error && <div className="text-red-500">{error}</div>}

            <Button onClick={() => setModalOpen(true)}>Neue Kategorie hinzufügen</Button>

            <CategoryTable
                categories={categories}
                onEdit={(category) => {
                    setEditingCategory(category);
                    setModalOpen(true);
                }}
                onDelete={deleteCategory}
                deletingId={deletingId}
            />

            <CategoryModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingCategory(null);
                }}
                onSave={saveCategory}
                initialName={editingCategory?.name}
                loading={loading}
            />
        </div>
    );
};

export default CategoryPage;
