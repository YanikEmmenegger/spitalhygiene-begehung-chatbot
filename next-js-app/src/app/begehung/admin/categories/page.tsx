'use client';

import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Button from '@/components/Button';
import Table from '@/components/Table';
import ConfirmDelete from '@/components/ConfirmDelete';
import {Category} from '@/types';
import CategoryModal from '@/components/admin/CategoryModal';

const CategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setPageError(null);
            try {
                const response = await axios.get('/api/category');
                setCategories(response.data.data || []);
            } catch (err) {
                const error = err as AxiosError<{ error: string }>;
                setPageError(error.response?.data?.error || 'Fehler beim Laden der Hauptkategorien.');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Save category (create or update)
    const saveCategory = (name: string, priority: number) => {
        return new Promise<void>(async (resolve, reject) => {
            setSaving(true);
            try {
                if (editingCategory) {
                    console.log(priority)
                    // Update existing category
                    await axios.put('/api/category', {
                        id: editingCategory.id,
                        name,
                        priority,
                    });
                    setCategories((prev) =>
                        prev.map((cat) =>
                            cat.id === editingCategory.id
                                ? { ...cat, name, priority }
                                : cat
                        )
                    );
                } else {
                    // Create new category
                    const response = await axios.post('/api/category', {
                        name,
                        priority, // might or might not be used in POST depending on your DB defaults
                    });
                    const newCat = response.data.data[0];
                    setCategories((prev) => [...prev, newCat]);
                }
                resolve();
            } catch (e) {
                const error = e as AxiosError<{ error: string }>;
                const errorMsg = error.response?.data?.error || 'Fehler beim Speichern der Kategorie.';
                reject(errorMsg);
            } finally {
                setSaving(false);
            }
        });
    };

    // Delete category
    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/category?id=${id}`);
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || 'Fehler beim Löschen der Kategorie.');
        } finally {
            setDeletingId(null);
        }
    };

    const openModal = (category?: Category) => {
        setEditingCategory(category || null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Hauptkategorien</h1>
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}

            <Button onClick={() => openModal()}>Neue Hauptkategorie hinzufügen</Button>

            <Table
                data={categories}
                columns={[
                    { header: 'Name', accessor: 'name' },
                    { header: 'Priorität', accessor: 'priority' }, // new column
                ]}
                actions={(item) => (
                    <div className="flex gap-2 justify-end items-center">
                        <Button onClick={() => openModal(item)}>Bearbeiten</Button>
                        <ConfirmDelete
                            onDelete={() => handleDelete(item.id)}
                            text={deletingId === item.id ? 'Löschen...' : 'Löschen'}
                            confirmText="Bestätigen"
                            disabled={deletingId === item.id}
                        />
                    </div>
                )}
                loading={loading}
                emptyMessage="Keine Kategorien verfügbar."
            />

            {modalOpen && (
                <CategoryModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSave={saveCategory}
                    initialName={editingCategory?.name}
                    initialPriority={editingCategory?.priority ?? 0}
                    loading={saving}
                />
            )}
        </div>
    );
};

export default CategoryPage;
