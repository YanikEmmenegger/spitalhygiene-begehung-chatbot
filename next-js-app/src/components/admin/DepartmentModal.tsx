'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { AxiosError } from "axios";

interface DepartmentModalProps {
    isOpen: boolean; // Controls whether the modal is open
    onClose: () => void; // Callback to close the modal
    onSave: (name: string, isEdit: boolean) => Promise<void>; // Callback to save department data
    initialName?: string; // Initial value for the department name
    isEdit?: boolean; // Indicates whether the modal is for editing or creating
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSave,
                                                             initialName = '', // Default value if no initial name is provided
                                                             isEdit = false, // Default to create mode if not specified
                                                         }) => {
    const [name, setName] = useState(initialName); // State for the department name
    const [modalError, setModalError] = useState<string | null>(null); // Error message for validation or save issues
    const [loading, setLoading] = useState<boolean>(false); // Indicates whether a save operation is in progress

    // Reset modal state whenever it opens
    useEffect(() => {
        if (isOpen) {
            setName(initialName); // Reset name to the initial value
            setModalError(null); // Clear any previous errors
            setLoading(false); // Reset loading state
        }
    }, [isOpen, initialName]);

    // Handle saving the department
    const handleSave = async () => {
        if (!name.trim()) {
            setModalError('Name darf nicht leer sein.'); // Validation: Name cannot be empty
            return;
        }
        setLoading(true); // Set loading state
        setModalError(null); // Clear any previous errors
        try {
            await onSave(name.trim(), isEdit); // Call the save callback with the trimmed name
            onClose(); // Close the modal on successful save
        } catch (err) {
            // Convert the error to an AxiosError to extract the message
            const error = err as AxiosError<{ message: string }>;
            setModalError(error?.message || 'Fehler beim Speichern der Abteilung.'); // Display a fallback error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? 'Abteilung bearbeiten' : 'Neue Abteilung hinzufügen'}
            </h2>
            {modalError && <p className="text-red-500 mb-4">{modalError}</p>}
            {/* Input field for department name */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name der Abteilung"
                className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
                {/* Cancel button */}
                <Button
                    onClick={onClose}
                    disabled={loading}
                    className="bg-gray-300 hover:bg-gray-400"
                >
                    Abbrechen
                </Button>
                {/* Save button */}
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Speichere...' : isEdit ? 'Speichern' : 'Hinzufügen'}
                </Button>
            </div>
        </Modal>
    );
};

export default DepartmentModal;
