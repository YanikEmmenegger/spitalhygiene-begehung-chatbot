'use client';

import React, { useEffect, useState } from 'react';
import { Department } from "@/types";
import axios, { AxiosError } from "axios";
import ConfirmDelete from "@/components/ConfirmDelete";
import Button from "@/components/Button";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import AddDepartmentModal from "@/components/admin/AddDepartmentModal";

const Page = () => {
    const [loading, setLoading] = useState<boolean>(true); // Initial loading state
    const [deleting, setDeleting] = useState<number | null>(null); // Tracks loading during deletion
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state

    // Helper function to handle Axios errors
    const handleAxiosError = (e: unknown, fallbackMessage: string): string => {
        const error = e as AxiosError<{ error: string }>;
        return error.response?.data?.error || fallbackMessage;
    };

    // Fetch departments
    const fetchDepartments = async () => {
        setError(null);
        //setLoading(true);
        try {
            const response = await axios.get('/api/departments');
            setDepartments(response.data.data || []);
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Laden der Abteilungen."));
        } finally {
            setLoading(false);
        }
    };

    // Delete a department
    const deleteDepartment = async (id: number) => {
        setError(null);
        setDeleting(id); // Set loading state for the specific department
        try {
            await axios.delete(`/api/departments?id=${id}`);
            await fetchDepartments(); // Refresh departments after deletion
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Löschen der Abteilung."));
        } finally {
            setDeleting(null);
        }
    };

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold mb-4">Abteilungen</h1>

            {/* Display error */}
            {error && <div className="text-red-500 mb-4">Error: {error}</div>}



            {/* Loading State */}
            {loading ? (
                <ul className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li
                            key={i}
                            className={twMerge(
                                "flex animate-pulse justify-between items-center p-2",
                                i % 2 === 0 ? "bg-neutral-100" : "bg-neutral-200"
                            )}
                        >
                            <span className="w-2/3 h-4 bg-gray-300 rounded"></span>
                            <div className="flex gap-2">
                                <Button className="bg-gray-300" disabled>
                                    Bearbeiten
                                </Button>
                                <Button className="bg-gray-300" disabled>
                                    Löschen
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // Department List
                <ul className="space-y-2">
                    {departments.length > 0 ? (
                        departments.map((department, index) => (
                            <li
                                key={department.id}
                                className={twMerge(
                                    "flex justify-between items-center p-2",
                                    index % 2 === 0 ? "bg-neutral-100" : "bg-neutral-200"
                                )}
                            >
                                <span>{department.name}</span>
                                <div className="flex gap-2">
                                    <Link href={`departments/${department.id}`}>
                                        <Button>Bearbeiten</Button>
                                    </Link>
                                    <ConfirmDelete
                                        onDelete={() => deleteDepartment(department.id)}
                                        text={
                                            deleting === department.id ? "Lösche..." : "Löschen"
                                        }
                                        confirmText="Bestätigen"
                                        disabled={deleting === department.id}
                                    />
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Keine Abteilungen vorhanden.</p>
                    )}
                </ul>
            )}
            {/* Button to add new department */}
            <div className="flex justify-end my-4">
                <Button onClick={toggleModal}>Neue Abteilung hinzufügen</Button>
            </div>

            {/* Add Department Modal */}
            <AddDepartmentModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                onAdd={fetchDepartments}
            />
        </div>
    );
};

export default Page;
