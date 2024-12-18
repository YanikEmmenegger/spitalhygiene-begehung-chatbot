'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { Category } from '@/types';

interface SubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, categoryId: number) => Promise<void>;
    categories: Category[];
    initialName?: string;
    initialCategoryId?: number;
    loading: boolean;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onSave,
                                                               categories,
                                                               initialName = '',
                                                               initialCategoryId,
                                                               loading,
                                                           }) => {
    const [name, setName] = useState(initialName || '');
    const [categoryId, setCategoryId] = useState<number | ''>(initialCategoryId || '');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(initialName || '');
        setCategoryId(initialCategoryId || '');
        setError(null);
    }, [isOpen, initialName, initialCategoryId]);

    const handleSave = async () => {
        setError(null);
        if (!name.trim()) {
            setError('Der Name darf nicht leer sein.');
            return;
        }
        if (!categoryId) {
            setError('Es muss eine Kategorie ausgewählt werden.');
            return;
        }
        try {
            await onSave(name.trim(), categoryId as number);
            // If successful, close modal and reset fields
            onClose();
        } catch (err) {
            // Show server error in the modal and keep it open
            setError(String(err));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                Unterkategorie
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
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
                <div>
                    <label className="block text-sm font-medium mb-1">Kategorie</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value) || '')}
                    >
                        <option value="">Kategorie auswählen</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end mt-6 gap-2 items-center">
                <Button onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400 min-w-[100px]">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading} className="min-w-[100px]">
                    {loading ? 'Speichern...' : 'Speichern'}
                </Button>
            </div>
        </Modal>
    );
};

export default SubcategoryModal;
