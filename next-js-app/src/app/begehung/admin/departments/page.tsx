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
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    //const [creating, setCreating] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);
    const [editDepartmentName, setEditDepartmentName] = useState<string>('');

    // Fetch all departments on page load
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/departments');
                setDepartments(response.data.data || []);
            } catch (err) {
                const error = err as AxiosError<{error: string}>;
                setError(error.response?.data?.error || 'Fehler beim Laden der Abteilungen.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditDepartmentId(null);
        setEditDepartmentName('');
        setEditing(false);
        setModalOpen(true);
    };

    const openEditModal = (dep: Department) => {
        setEditDepartmentId(dep.id);
        setEditDepartmentName(dep.name);
        setEditing(true);
        setModalOpen(true);
    };

    const handleSaveDepartment = async (name: string, isEdit: boolean) => {
        // Called from modal
        if (!isEdit) {
            // Create
            const response = await axios.post('/api/departments', { name });
            let newDep = response.data.data;
            if (Array.isArray(newDep)) {
                newDep = newDep[0];
            }
            setDepartments((prev) => [...prev, newDep]);
        } else {
            // Edit
            if (!editDepartmentId) throw new Error('Edit mode but no department ID');
            await axios.put('/api/departments', { id: editDepartmentId, name });
            setDepartments((prev) =>
                prev.map((d) => (d.id === editDepartmentId ? { ...d, name } : d))
            );
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        setError(null);
        try {
            await axios.delete(`/api/departments?id=${id}`);
            setDepartments((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            const error = err as AxiosError<{error: string}>;
            setError(error.response?.data?.error || 'Fehler beim Löschen der Abteilung.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Abteilungen</h1>
            {error && <p className="text-red-500">{error}</p>}

            <Button onClick={openCreateModal}>Neue Abteilung hinzufügen</Button>

            <Table
                data={departments}
                columns={[
                    { header: 'Name', accessor: (item) => item.name },
                ]}
                actions={(item) => (
                    <div className="flex gap-2 justify-end items-center">
                        <Button onClick={() => openEditModal(item)}>
                            Bearbeiten
                        </Button>
                        <Link href={`/begehung/admin/departments/${item.id}`}>
                            <Button className={"bg-blue-500 hover:bg-blue-600"}>
                                Fragen
                            </Button>
                        </Link>
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

            {modalOpen && (
                <DepartmentModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveDepartment}
                    initialName={editDepartmentName}
                    isEdit={editing}
                />
            )}
        </div>
    );
};

export default DepartmentsPage;
