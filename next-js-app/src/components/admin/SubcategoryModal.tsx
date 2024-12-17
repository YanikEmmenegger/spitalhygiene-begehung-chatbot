'use client';

import React, {useEffect, useState} from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import {Category} from '@/types';

interface SubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, categoryId: number) => void;
    categories: Category[];
    loading: boolean;
    initialName?: string;
    initialCategoryId?: number;
}

const SubcategoryModal: React.FC<SubcategoryModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               onSave,
                                                               categories,
                                                               loading,
                                                               initialName = '',
                                                               initialCategoryId = undefined,
                                                           }) => {
    const [name, setName] = useState<string>(initialName);
    const [selectedCategory, setSelectedCategory] = useState<number | ''>(initialCategoryId || '');
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        setName(initialName || '');
        setSelectedCategory(initialCategoryId || '');
        setError(null);
    }, [isOpen, initialName, initialCategoryId]);

    const handleSave = () => {
        if (!name.trim() || !selectedCategory) {
            setError('Name und Kategorie sind erforderlich.');
            return;
        }
        onSave(name.trim(), Number(selectedCategory));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">
                {initialName ? 'Unterkategorie bearbeiten' : 'Neue Unterkategorie hinzufügen'}
            </h2>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Name Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name der Unterkategorie
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    placeholder="Name eingeben"
                />
            </div>

            {/* Category Dropdown */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                    className="w-full border p-2 rounded-md"
                >
                    <option value="">Bitte wählen...</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
                <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {loading ? 'Speichern...' : initialName ? 'Änderungen speichern' : 'Hinzufügen'}
                </Button>
            </div>
        </Modal>
    );
};

export default SubcategoryModal;
