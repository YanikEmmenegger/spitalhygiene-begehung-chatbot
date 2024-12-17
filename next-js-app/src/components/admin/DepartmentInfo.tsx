'use client';

import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Department } from "@/types";
import Button from "@/components/Button";

interface DepartmentInfoProps {
    id: string;
    setError: (error: string | null) => void;
}

const DepartmentInfo: FC<DepartmentInfoProps> = ({ id, setError }) => {
    const [department, setDepartment] = useState<Department | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);

    const fetchDepartment = async () => {
        setError(null);
        try {
            const response = await axios.get(`/api/departments?id=${id}`);
            setDepartment(response.data.data);
            setNewName(response.data.data.name);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || "Fehler beim Laden der Abteilung.");
        }
    };

    const updateDepartmentName = async () => {
        if (!newName.trim()) {
            setError("Der Abteilungsname darf nicht leer sein.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await axios.put("/api/departments", { id, name: newName.trim() });
            setDepartment((prev) => (prev ? { ...prev, name: newName.trim() } : null));
            setEditMode(false);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || "Fehler beim Aktualisieren der Abteilung.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    return (
        <div className="p-4 rounded-md shadow-md bg-neutral-100 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Name der Abteilung:</h2>
            {editMode ? (
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border p-2 rounded-md w-full"
                    />
                    <div className="flex gap-2">
                        <Button onClick={updateDepartmentName} disabled={saving}>
                            {saving ? "Speichern..." : "Speichern"}
                        </Button>
                        <Button onClick={() => setEditMode(false)}>Abbrechen</Button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p>{department?.name}</p>
                    <Button onClick={() => setEditMode(true)}>Bearbeiten</Button>
                </div>
            )}
        </div>
    );
};

export default DepartmentInfo;
