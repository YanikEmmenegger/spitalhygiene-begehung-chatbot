'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, priority: number) => Promise<void>;
    initialName?: string;
    initialPriority?: number;
    loading?: boolean;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSave,
                                                         initialName = '',
                                                         initialPriority = 0,
                                                         loading,
                                                     }) => {
    const [name, setName] = useState(initialName);
    /**
     * Store priority as a *string* to avoid passing NaN to <input>.
     */
    const [priorityStr, setPriorityStr] = useState(String(initialPriority));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setPriorityStr(String(initialPriority));
            setError(null);
        }
    }, [isOpen, initialName, initialPriority]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name darf nicht leer sein.');
            return;
        }
        setError(null);

        /**
         * Safely parse the string to a number, default to 0 if empty or invalid.
         */
        const parsedPriority = parseInt(priorityStr, 10);
        const safePriority = Number.isNaN(parsedPriority) ? 0 : parsedPriority;

        try {
            await onSave(name.trim(), safePriority);
            onClose(); // Only close if onSave didn't throw
        } catch (err) {
            console.log(err);
            setError('Fehler beim Speichern der Kategorie.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">
                {initialName ? 'Kategorie bearbeiten' : 'Neue Kategorie hinzufügen'}
            </h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex flex-col gap-4">
                {/* Name input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Kategoriename"
                    />
                </div>

                {/* Priority input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Priorität</label>
                    <input
                        type="number"
                        className="border p-2 rounded w-full"
                        value={priorityStr}
                        onChange={(e) => setPriorityStr(e.target.value)}
                        placeholder="z.B. 1"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Speichere...' : (initialName ? 'Ändern' : 'Hinzufügen')}
                </Button>
            </div>
        </Modal>
    );
};

export default CategoryModal;
