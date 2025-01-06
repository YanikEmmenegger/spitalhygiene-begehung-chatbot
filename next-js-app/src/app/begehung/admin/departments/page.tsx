'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import Button from '@/components/Button';
import ConfirmDelete from '@/components/ConfirmDelete';
import Table from '@/components/Table';
import { Department } from '@/types';
import DepartmentModal from '@/components/admin/DepartmentModal';

const DepartmentsPage = () => {
    // State management
    const [departments, setDepartments] = useState<Department[]>([]); // List of departments
    const [error, setError] = useState<string | null>(null); // Error message
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching departments
    const [editing, setEditing] = useState<boolean>(false); // Edit mode flag
    const [modalOpen, setModalOpen] = useState<boolean>(false); // Modal open state
    const [deletingId, setDeletingId] = useState<number | null>(null); // ID of the department being deleted
    const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null); // ID of the department being edited
    const [editDepartmentName, setEditDepartmentName] = useState<string>(''); // Name of the department being edited/created

    // Fetch all departments on page load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/departments');
                setDepartments(response.data.data || []);
            } catch (err) {
                const error = err as AxiosError<{ error: string }>;
                setError(error.response?.data?.error || 'Fehler beim Laden der Abteilungen.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Open modal to create a new department
    const openCreateModal = () => {
        setEditDepartmentId(null); // Clear the ID for create mode
        setEditDepartmentName(''); // Clear the name for create mode
        setEditing(false); // Set to create mode
        setModalOpen(true); // Open the modal
    };

    // Open modal to edit an existing department
    const openEditModal = (dep: Department) => {
        setEditDepartmentId(dep.id); // Set the ID for the department being edited
        setEditDepartmentName(dep.name); // Set the name for the department being edited
        setEditing(true); // Set to edit mode
        setModalOpen(true); // Open the modal
    };

    // Handle saving (creating or updating) a department
    const handleSaveDepartment = async (name: string, isEdit: boolean) => {
        if (!isEdit) {
            // Create a new department
            const response = await axios.post('/api/departments', { name });
            let newDep = response.data.data;
            if (Array.isArray(newDep)) {
                newDep = newDep[0];
            }
            setDepartments((prev) => [...prev, newDep]); // Add the new department to the state
        } else {
            // Update an existing department
            if (!editDepartmentId) throw new Error('Edit mode but no department ID');
            await axios.put('/api/departments', { id: editDepartmentId, name });
            setDepartments((prev) =>
                prev.map((d) => (d.id === editDepartmentId ? { ...d, name } : d))
            ); // Update the name in the state
        }
    };

    // Handle deleting a department
    const handleDelete = async (id: number) => {
        setDeletingId(id); // Set the ID of the department being deleted
        setError(null);
        try {
            await axios.delete(`/api/departments?id=${id}`);
            setDepartments((prev) => prev.filter((d) => d.id !== id)); // Remove the department from the state
        } catch (err) {
            const error = err as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || 'Fehler beim Löschen der Abteilung.');
        } finally {
            setDeletingId(null); // Clear the deleting ID
        }
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Abteilungen</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Button to open modal for creating a new department */}
            <Button onClick={openCreateModal}>Neue Abteilung hinzufügen</Button>

            {/* Table to display departments */}
            <Table
                data={departments}
                columns={[
                    { header: 'Name', accessor: (item) => item.name }, // Display department name
                ]}
                actions={(item) => (
                    <div className="flex gap-2 justify-end items-center">
                        {/* Edit button */}
                        <Button onClick={() => openEditModal(item)}>Bearbeiten</Button>

                        {/* Link to department detail page */}
                        <Link href={`/begehung/admin/departments/${item.id}`}>
                            <Button className="bg-blue-500 hover:bg-blue-600">Fragen</Button>
                        </Link>

                        {/* Delete confirmation button */}
                        <ConfirmDelete
                            onDelete={() => handleDelete(item.id)}
                            text={deletingId === item.id ? 'Löschen...' : 'Löschen'}
                            confirmText="Bestätigen"
                            disabled={deletingId === item.id}
                        />
                    </div>
                )}
                loading={loading}
                emptyMessage="Keine Abteilungen verfügbar."
            />

            {/* Modal for creating or editing a department */}
            {modalOpen && (
                <DepartmentModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)} // Close the modal
                    onSave={handleSaveDepartment} // Save department (create or update)
                    initialName={editDepartmentName} // Initial name for the modal input
                    isEdit={editing} // Indicates whether it's edit mode
                />
            )}
        </div>
    );
};

export default DepartmentsPage;
