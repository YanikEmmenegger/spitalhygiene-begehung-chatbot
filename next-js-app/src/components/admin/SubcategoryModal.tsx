"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { Category } from "@/types";

interface SubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (
        name: string,
        categoryId: number,
        priority: number,
        linkName: string | null,
        linkUrl: string | null
    ) => Promise<void>;
    categories: Category[];
    initialName?: string;
    initialCategoryId?: number;
    initialPriority?: number;
    /** New fields for link name/url (nullable). */
    initialLinkName?: string | null;
    initialLinkUrl?: string | null;
    loading: boolean;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onSave,
                                                               categories,
                                                               initialName = "",
                                                               initialCategoryId,
                                                               initialPriority = 0,
                                                               initialLinkName = null,
                                                               initialLinkUrl = null,
                                                               loading,
                                                           }) => {
    const [name, setName] = useState(initialName);
    const [categoryId, setCategoryId] = useState<number | "">(
        initialCategoryId || ""
    );
    const [priorityStr, setPriorityStr] = useState<string>(String(initialPriority));
    const [linkName, setLinkName] = useState<string>(initialLinkName || "");
    const [linkUrl, setLinkUrl] = useState<string>(initialLinkUrl || "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setCategoryId(initialCategoryId || "");
            setPriorityStr(String(initialPriority));
            setLinkName(initialLinkName || "");
            setLinkUrl(initialLinkUrl || "");
            setError(null);
        }
    }, [
        isOpen,
        initialName,
        initialCategoryId,
        initialPriority,
        initialLinkName,
        initialLinkUrl,
    ]);

    const handleSave = async () => {
        setError(null);
        if (!name.trim()) {
            setError("Der Name darf nicht leer sein.");
            return;
        }
        if (!categoryId) {
            setError("Es muss eine Kategorie ausgewählt werden.");
            return;
        }

        // Safely parse the priority string, default to 0 if invalid
        const parsedPriority = parseInt(priorityStr, 10);
        const safePriority = Number.isNaN(parsedPriority) ? 0 : parsedPriority;

        try {
            await onSave(
                name.trim(),
                categoryId as number,
                safePriority,
                linkName?.trim() || null,
                linkUrl?.trim() || null
            );
            onClose();
        } catch (err) {
            // Show server error in the modal and keep it open
            setError(String(err));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                {initialName ? "Unterkategorie bearbeiten" : "Neue Unterkategorie hinzufügen"}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Unterkategoriename eingeben"
                    />
                </div>

                {/* Category dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Kategorie</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value) || "")}
                    >
                        <option value="">Kategorie auswählen</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium mb-1">Priorität</label>
                    <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={priorityStr}
                        onChange={(e) => setPriorityStr(e.target.value)}
                        placeholder="z.B. 1"
                    />
                </div>

                {/* Link Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Link Name (optional)</label>
                    <input
                        type="text"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. Hier klicken"
                    />
                </div>

                {/* Link URL */}
                <div>
                    <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. https://example.com"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-6 gap-2 items-center">
                <Button
                    onClick={onClose}
                    disabled={loading}
                    className="bg-gray-300 hover:bg-gray-400 min-w-[100px]"
                >
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading} className="min-w-[100px]">
                    {loading ? "Speichern..." : "Speichern"}
                </Button>
            </div>
        </Modal>
    );
};

export default SubcategoryModal;
