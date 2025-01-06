'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Button from '@/components/Button';
import Table from '@/components/Table';
import ConfirmDelete from '@/components/ConfirmDelete';
import { Category } from '@/types';
import CategoryModal from '@/components/admin/CategoryModal';

const CategoryPage = () => {
    // State management
    const [categories, setCategories] = useState<Category[]>([]); // List of categories
    const [pageError, setPageError] = useState<string | null>(null); // Error when loading categories
    const [deleteError, setDeleteError] = useState<string | null>(null); // Error when deleting a category
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching categories
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Modal open state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Category being edited
    const [deletingId, setDeletingId] = useState<number | null>(null); // ID of the category being deleted
    const [saving, setSaving] = useState<boolean>(false); // Loading state for saving a category

    // Fetch categories on component mount
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
                    // Update existing category
                    await axios.put('/api/category', {
                        id: editingCategory.id,
                        name,
                        priority,
                    });
                    // Update the category in the state
                    setCategories((prev) =>
                        prev.map((cat) =>
                            cat.id === editingCategory.id ? { ...cat, name, priority } : cat
                        )
                    );
                } else {
                    // Create a new category
                    const response = await axios.post('/api/category', {
                        name,
                        priority, // Pass priority or let the backend handle defaults
                    });
                    const newCat = response.data.data[0];
                    setCategories((prev) => [...prev, newCat]); // Add the new category to the state
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

    // Delete a category
    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/category?id=${id}`);
            // Remove the deleted category from the state
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || 'Fehler beim Löschen der Kategorie.');
        } finally {
            setDeletingId(null);
        }
    };

    // Open the modal (for creating or editing)
    const openModal = (category?: Category) => {
        setEditingCategory(category || null); // Set the category being edited or null for a new category
        setModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Hauptkategorien</h1>
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}

            {/* Button to open modal for adding a new category */}
            <Button onClick={() => openModal()}>Neue Hauptkategorie hinzufügen</Button>

            {/* Table to display categories */}
            <Table
                data={categories}
                columns={[
                    { header: 'Name', accessor: 'name' },
                    { header: 'Priorität', accessor: 'priority' }, // Added priority column
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

            {/* Modal for creating or editing a category */}
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
