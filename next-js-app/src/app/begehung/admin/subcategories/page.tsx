'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Button from '@/components/Button';
import Table from '@/components/Table';
import ConfirmDelete from '@/components/ConfirmDelete';
import SubcategoryModal from '@/components/admin/SubcategoryModal';
import { Category, SubCategory } from '@/types';

const SubcategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catsRes, subsRes] = await Promise.all([
                    axios.get('/api/category'),
                    axios.get('/api/subcategory'),
                ]);
                setCategories(catsRes.data.data || []);
                setSubcategories(subsRes.data.data || []);
            } catch (err) {
                const error = err as AxiosError<{ error: string }>;

                setPageError(error.response?.data?.error || 'Fehler beim Laden der Unterkategorien.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const saveSubcategory = async (name: string, categoryId: number) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                if (editingSubcategory) {
                    // Update existing subcategory
                    await axios.put('/api/subcategory', {
                        id: editingSubcategory.id,
                        name,
                        category: categoryId,
                    });
                    setSubcategories((prev) =>
                        prev.map((sub) =>
                            sub.id === editingSubcategory.id
                                ? {
                                    ...sub,
                                    name,
                                    category: categories.find((cat) => cat.id === categoryId)!,
                                }
                                : sub
                        )
                    );
                } else {
                    // Create new subcategory
                    const response = await axios.post('/api/subcategory', { name, category: categoryId });
                    const newSub = {
                        ...response.data.data[0],
                        category: categories.find((cat) => cat.id === categoryId)!,
                    };
                    setSubcategories((prev) => [...prev, newSub]);
                }
                resolve();
            } catch (e) {
                const error = e as AxiosError<{ error: string }>;
                const errorMsg = error.response?.data?.error || 'Fehler beim Speichern der Unterkategorie.';
                reject(errorMsg);
            }
        });
    };

    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/subcategory?id=${id}`);
            setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || 'Fehler beim Löschen der Unterkategorie.');
        } finally {
            setDeletingId(null);
        }
    };

    const openModal = (subcategory?: SubCategory) => {
        setEditingSubcategory(subcategory || null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingSubcategory(null);
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Unterkategorien</h1>
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}
            <Button onClick={() => openModal()}>Neue Unterkategorie hinzufügen</Button>
            <Table
                data={subcategories}
                columns={[
                    { header: 'Name', accessor: 'name' },
                    { header: 'Kategorie', accessor: (item) => item.category.name },
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
                emptyMessage="Keine Unterkategorien verfügbar."
            />
            {modalOpen && (
                <SubcategoryModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSave={saveSubcategory}
                    categories={categories}
                    initialName={editingSubcategory?.name}
                    initialCategoryId={editingSubcategory?.category.id}
                    loading={false}
                />
            )}
        </div>
    );
};

export default SubcategoryPage;
