'use client';

import React, {useEffect, useState} from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => Promise<void>;
    initialName?: string;
    loading: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSave,
                                                         initialName = '',
                                                         loading,
                                                     }) => {
    const [name, setName] = useState(initialName || '');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(initialName || '');
            setError(null);
        }
    }, [isOpen, initialName]);

    const handleSave = async () => {
        setError(null);
        if (!name.trim()) {
            setError('Der Name darf nicht leer sein.');
            return;
        }

        try {
            await onSave(name.trim());
            // On success, close modal
            onClose();
        } catch (err) {
            // Show server error in modal
            setError(String(err));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Kategorie</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Kategoriename eingeben"
                    />
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

export default CategoryModal;
