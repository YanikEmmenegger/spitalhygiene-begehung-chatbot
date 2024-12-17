'use client';

import React, {useEffect, useState} from 'react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    initialName?: string;
    loading: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({isOpen, onClose, onSave, initialName = '', loading}) => {
    const [name, setName] = useState<string>(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSave = () => {
        if (!name.trim()) return; // Prevent empty submissions
        onSave(name.trim());
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">{initialName ? 'Kategorie bearbeiten' : 'Neue Kategorie hinzufügen'}</h2>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded-md mb-4"
                placeholder="Name der Kategorie"
            />

            <div className="flex justify-end gap-2">
                <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Speichern...' : 'Speichern'}
                </Button>
            </div>
        </Modal>
    );
};

export default CategoryModal;
