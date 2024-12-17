'use client';

import React, {useState} from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axios, {AxiosError} from "axios";

interface AddDepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void; // Callback to refresh the departments list
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({isOpen, onClose, onAdd}) => {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Handle form submission
    const handleSubmit = async () => {
        setError(null);
        if (!name.trim()) {
            setError("Der Name der Abteilung darf nicht leer sein.");
            return;
        }

        setLoading(true);
        try {
            // POST request to add a new department
            await axios.post("/api/departments", {name: name.trim()});
            setName(""); // Reset the input
            onAdd(); // Refresh the list
            onClose(); // Close the modal
        } catch (e) {
            const axiosError = e as AxiosError<{ error: string }>;
            console.log(axiosError.response?.data?.error)
            setError("Fehler beim Hinzufügen der Abteilung. (Abteilung existiert bereits?)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Neue Abteilung hinzufügen</h2>
            <p className="text-gray-600 mb-4">Bitte geben Sie den Namen der neuen Abteilung ein.</p>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
                type="text"
                placeholder="Name der Abteilung"
                className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:ring-lightGreen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
            />

            <div className="flex justify-end gap-3">
                <Button className="bg-neutral-400 text-black" onClick={onClose} disabled={loading}>
                    Abbrechen
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Speichern..." : "Hinzufügen"}
                </Button>
            </div>
        </Modal>
    );
};

export default AddDepartmentModal;
