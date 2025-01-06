"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Button from "@/components/Button";
import Table from "@/components/Table";
import ConfirmDelete from "@/components/ConfirmDelete";
import SubcategoryModal from "@/components/admin/SubcategoryModal";
import { Category, SubCategory } from "@/types";

const SubcategoryPage = () => {
    // State Management
    const [categories, setCategories] = useState<Category[]>([]); // List of categories
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]); // List of subcategories
    const [pageError, setPageError] = useState<string | null>(null); // Page-level error message
    const [deleteError, setDeleteError] = useState<string | null>(null); // Error message for delete operation
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Modal visibility state
    const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null); // Subcategory being edited
    const [deletingId, setDeletingId] = useState<number | null>(null); // ID of the subcategory being deleted
    const [saving, setSaving] = useState<boolean>(false); // Saving state for create/edit operations

    // Fetch categories and subcategories on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catsRes, subsRes] = await Promise.all([
                    axios.get("/api/category"), // Fetch categories
                    axios.get("/api/subcategory"), // Fetch subcategories
                ]);
                setCategories(catsRes.data.data || []);
                setSubcategories(subsRes.data.data || []);
            } catch (err) {
                const error = err as AxiosError<{ error: string }>;
                setPageError(error.response?.data?.error || "Fehler beim Laden der Unterkategorien.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /**
     * Save a subcategory (create or update).
     * @param name - The name of the subcategory
     * @param categoryId - The ID of the parent category
     * @param priority - The priority of the subcategory
     * @param linkName - Optional link name
     * @param linkUrl - Optional link URL
     */
    const saveSubcategory = (
        name: string,
        categoryId: number,
        priority: number,
        linkName: string | null,
        linkUrl: string | null
    ) => {
        return new Promise<void>(async (resolve, reject) => {
            setSaving(true);
            try {
                if (editingSubcategory) {
                    // Update existing subcategory
                    await axios.put("/api/subcategory", {
                        id: editingSubcategory.id,
                        name,
                        category: categoryId,
                        priority,
                        link_name: linkName,
                        link_url: linkUrl,
                    });

                    // Update local state with the updated subcategory
                    setSubcategories((prev) =>
                        prev.map((sub) =>
                            sub.id === editingSubcategory.id
                                ? {
                                    ...sub,
                                    name,
                                    priority,
                                    link_name: linkName || null,
                                    link_url: linkUrl || null,
                                    category: categories.find((cat) => cat.id === categoryId)!,
                                }
                                : sub
                        )
                    );
                } else {
                    // Create new subcategory
                    const response = await axios.post("/api/subcategory", {
                        name,
                        category: categoryId,
                        priority,
                        link_name: linkName,
                        link_url: linkUrl,
                    });

                    const newSub = {
                        ...response.data.data[0],
                        category: categories.find((cat) => cat.id === categoryId)!,
                    };

                    setSubcategories((prev) => [...prev, newSub]);
                }
                resolve();
            } catch (e) {
                const error = e as AxiosError<{ error: string }>;
                const errorMsg = error.response?.data?.error || "Fehler beim Speichern der Unterkategorie.";
                reject(errorMsg);
            } finally {
                setSaving(false);
            }
        });
    };

    /**
     * Handle deletion of a subcategory.
     * @param id - The ID of the subcategory to delete
     */
    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/subcategory?id=${id}`);
            // Remove the deleted subcategory from local state
            setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || "Fehler beim Löschen der Unterkategorie.");
        } finally {
            setDeletingId(null);
        }
    };

    /**
     * Open the modal for creating or editing a subcategory.
     * @param subcategory - Optional subcategory to edit
     */
    const openModal = (subcategory?: SubCategory) => {
        setEditingSubcategory(subcategory || null); // Set the subcategory to edit (or null for new)
        setModalOpen(true); // Open the modal
    };

    /**
     * Close the modal and reset editing state.
     */
    const closeModal = () => {
        setModalOpen(false);
        setEditingSubcategory(null); // Clear editing state
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Unterkategorien</h1>
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}

            {/* Button to open the modal for creating a new subcategory */}
            <Button onClick={() => openModal()}>Neue Unterkategorie hinzufügen</Button>

            {/* Table to display subcategories */}
            <Table
                data={subcategories}
                columns={[
                    { header: "Name", accessor: "name" },
                    { header: "Priorität", accessor: "priority" },
                    {
                        header: "Kategorie",
                        accessor: (item) => item.category?.name || "Keine",
                    },
                    {
                        header: "Link",
                        accessor: (item) =>
                            item.link_name && item.link_url
                                ? `${item.link_name} (${item.link_url})`
                                : "",
                    },
                ]}
                actions={(item) => (
                    <div className="flex gap-2 justify-end items-center">
                        <Button onClick={() => openModal(item)}>Bearbeiten</Button>
                        <ConfirmDelete
                            onDelete={() => handleDelete(item.id)}
                            text={deletingId === item.id ? "Löschen..." : "Löschen"}
                            confirmText="Bestätigen"
                            disabled={deletingId === item.id}
                        />
                    </div>
                )}
                loading={loading}
                emptyMessage="Keine Unterkategorien verfügbar."
            />

            {/* Modal for creating or editing subcategories */}
            {modalOpen && (
                <SubcategoryModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSave={saveSubcategory}
                    categories={categories}
                    initialName={editingSubcategory?.name}
                    initialCategoryId={editingSubcategory?.category.id}
                    initialPriority={editingSubcategory?.priority ?? 0}
                    initialLinkName={editingSubcategory?.link_name ?? null}
                    initialLinkUrl={editingSubcategory?.link_url ?? null}
                    loading={saving}
                />
            )}
        </div>
    );
};

export default SubcategoryPage;
