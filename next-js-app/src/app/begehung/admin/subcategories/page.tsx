"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Button from "@/components/Button";
import Table from "@/components/Table";
import ConfirmDelete from "@/components/ConfirmDelete";
import SubcategoryModal from "@/components/admin/SubcategoryModal";
import { Category, SubCategory } from "@/types";

/**
 * Helper function to truncate a string to the specified length
 * and append "..." if it's longer.
 */
function truncateString(value: string, maxLength = 30) {
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + "...";
}

const SubcategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catsRes, subsRes] = await Promise.all([
                    axios.get("/api/category"),
                    axios.get("/api/subcategory"),
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
     * Create or update a subcategory (name, categoryId, priority, linkName, linkUrl)
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
                    // Update existing
                    await axios.put("/api/subcategory", {
                        id: editingSubcategory.id,
                        name,
                        category: categoryId,
                        priority,
                        link_name: linkName,
                        link_url: linkUrl,
                    });

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
                    // Create new
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
     * Handle deletion of a subcategory
     */
    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/subcategory?id=${id}`);
            setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || "Fehler beim Löschen der Unterkategorie.");
        } finally {
            setDeletingId(null);
        }
    };

    /**
     * Open modal for create/edit
     */
    const openModal = (subcategory?: SubCategory) => {
        setEditingSubcategory(subcategory || null);
        setModalOpen(true);
    };

    /**
     * Close modal
     */
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
                    { header: "Name", accessor: "name" },
                    { header: "Priorität", accessor: "priority" },
                    {
                        header: "Kategorie",
                        accessor: (item) => item.category?.name || "Keine",
                    },
                    {
                        header: "Link",
                        // Truncate the link_url if it exists
                        accessor: (item) => {
                            const name = item.link_name || "";
                            const url = item.link_url || "";
                            if (!url) return ""; // no link to display

                            // optionally truncate the URL for display
                            const truncatedUrl = truncateString(url, 30);

                            // if link_name is present, show "link_name (truncatedUrl)" else just truncatedUrl
                            return name
                                ? `${name} (${truncatedUrl})`
                                : `${truncatedUrl}`;
                        },
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
