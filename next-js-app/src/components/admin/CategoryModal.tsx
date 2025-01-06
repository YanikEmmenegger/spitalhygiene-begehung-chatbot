'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface CategoryModalProps {
    isOpen: boolean; // Controls the modal's visibility
    onClose: () => void; // Callback to close the modal
    onSave: (name: string, priority: number) => Promise<void>; // Callback to save the category
    initialName?: string; // Optional initial value for the category name
    initialPriority?: number; // Optional initial value for the priority
    loading?: boolean; // Indicates whether a save operation is in progress
}

const CategoryModal: React.FC<CategoryModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSave,
                                                         initialName = '', // Default to an empty string if no initial name is provided
                                                         initialPriority = 0, // Default to 0 if no initial priority is provided
                                                         loading,
                                                     }) => {
    // State to manage form inputs
    const [name, setName] = useState(initialName); // Category name
    const [priorityStr, setPriorityStr] = useState(String(initialPriority)); // Priority as a string
    const [error, setError] = useState<string | null>(null); // Error message for validation or save issues

    // Reset the form when the modal opens
    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setPriorityStr(String(initialPriority));
            setError(null);
        }
    }, [isOpen, initialName, initialPriority]);

    // Handle the save operation
    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name darf nicht leer sein.'); // Validate that the name is not empty
            return;
        }
        setError(null); // Clear previous errors

        // Parse the priority string to a number and default to 0 if invalid
        const parsedPriority = parseInt(priorityStr, 10);
        const safePriority = Number.isNaN(parsedPriority) ? 0 : parsedPriority;

        try {
            await onSave(name.trim(), safePriority); // Call the onSave callback
            onClose(); // Close the modal if the save was successful
        } catch (err) {
            console.error(err); // Log any errors
            setError('Fehler beim Speichern der Kategorie.'); // Display a generic error message
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

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    onClick={onClose}
                    disabled={loading}
                    className="bg-gray-300 hover:bg-gray-400"
                >
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
