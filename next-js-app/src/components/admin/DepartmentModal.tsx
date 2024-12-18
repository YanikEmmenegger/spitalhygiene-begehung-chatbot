'use client';

import React, {useEffect, useState} from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import {AxiosError} from "axios";

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, isEdit: boolean) => Promise<void>;
    initialName?: string;
    isEdit?: boolean;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onSave,
                                                             initialName = '',
                                                             isEdit = false,
                                                         }) => {
    const [name, setName] = useState(initialName);
    const [modalError, setModalError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setModalError(null);
            setLoading(false);
        }
    }, [isOpen, initialName]);

    const handleSave = async () => {
        if (!name.trim()) {
            setModalError('Name darf nicht leer sein.');
            return;
        }
        setLoading(true);
        setModalError(null);
        try {
            await onSave(name.trim(), isEdit);
            onClose();
        } catch (err) {
            // onSave throws error with err.message
            //convert to AxiosError to get the error message
            const error = err as AxiosError<{ message: string }>;
            setModalError(error?.message || 'Fehler beim Speichern der Abteilung.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">
                {isEdit ? 'Abteilung bearbeiten' : 'Neue Abteilung hinzufügen'}
            </h2>
            {modalError && <p className="text-red-500 mb-4">{modalError}</p>}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name der Abteilung"
                className="w-full border border-gray-300 p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
                <Button onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Speichere...' : isEdit ? 'Speichern' : 'Hinzufügen'}
                </Button>
            </div>
        </Modal>
    );
};

export default DepartmentModal;
