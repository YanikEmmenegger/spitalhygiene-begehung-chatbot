'use client';

import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import {useParams} from 'next/navigation';
import {Department, Question, QUESTION_TYPES, SubCategory} from '@/types';
import Button from '@/components/Button';
import QuestionFilter from '@/components/admin/QuestionFilter';
import QuestionTable from '@/components/admin/QuestionTable';
import DepartmentAddQuestionsModal from "@/components/admin/DepartmentAddQuestionModal";

interface Filters {
    search?: string;
    category?: number;
    subcategory?: number;
    critical?: boolean;
}

const DepartmentDetailPage = () => {
    const {id} = useParams() as { id: string };
    const departmentId = Number(id);

    const [department, setDepartment] = useState<Department | null>(null);
    const [departmentError, setDepartmentError] = useState<string | null>(null);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [connectedQuestions, setConnectedQuestions] = useState<Question[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [savingName, setSavingName] = useState<boolean>(false);

    const [filters, setFilters] = useState<Filters>({});
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

    const [addingModalOpen, setAddingModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const hasFilters = () => {
        return filters.search?.trim() || filters.category || filters.subcategory || filters.critical;
    };

    const applyLocalFilters = () => {
        let filtered = [...connectedQuestions];

        if (!hasFilters()) {
            setFilteredQuestions(connectedQuestions);
            return;
        }

        // search
        if (filters.search && filters.search.trim()) {
            const s = filters.search.trim().toLowerCase();
            filtered = filtered.filter(q => q.question.toLowerCase().includes(s));
        }

        if (filters.critical) {
            filtered = filtered.filter(q => q.critical);
        }

        if (filters.subcategory) {
            filtered = filtered.filter(q => q.subcategory.id === filters.subcategory);
        } else if (filters.category) {
            filtered = filtered.filter(q => q.subcategory.category.id === filters.category);
        }

        setFilteredQuestions(filtered);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setPageError(null);
            setDepartmentError(null);
            try {
                // Fetch department
                const depRes = await axios.get(`/api/departments?id=${departmentId}`);
                let dep = depRes.data.data;
                if (Array.isArray(dep)) dep = dep[0];
                setDepartment(dep);
                setNewName(dep.name);

                // Fetch connected questions
                const cqRes = await axios.get(`/api/questions?department=${departmentId}`);
                const fetchedConnected: Question[] = cqRes.data.data || [];
                // Validate types
                for (const q of fetchedConnected) {
                    if (!q.type || !QUESTION_TYPES.includes(q.type)) q.type = null;
                }

                // Fetch all questions and subcategories
                const [qRes, scRes] = await Promise.all([
                    axios.get('/api/questions'),
                    axios.get('/api/subcategory'),
                ]);

                const fetchedAll: Question[] = qRes.data.data || [];
                for (const q of fetchedAll) {
                    if (!q.type || !QUESTION_TYPES.includes(q.type)) q.type = null;
                }

                const fetchedSubcategories: SubCategory[] = scRes.data.data || [];

                setAllQuestions(fetchedAll);
                setSubcategories(fetchedSubcategories);
                setConnectedQuestions(fetchedConnected);
                setFilteredQuestions(fetchedConnected);

            } catch (err) {
                console.log(err);
                setPageError('Fehler beim Laden der Abteilung oder Fragen.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [departmentId]);

    useEffect(() => {
        if (!hasFilters()) {
            setFilteredQuestions(connectedQuestions);
        } else {
            applyLocalFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, connectedQuestions]);

    const handleNameSave = async () => {
        if (!department) return;
        if (!newName.trim()) {
            setDepartmentError('Name darf nicht leer sein.');
            return;
        }
        setSavingName(true);
        setDepartmentError(null);
        try {
            await axios.put('/api/departments', {id: department.id, name: newName.trim()});
            setDepartment((prev) => prev ? {...prev, name: newName.trim()} : null);
            setEditMode(false);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDepartmentError(error.response?.data?.error || 'Fehler beim Aktualisieren der Abteilung.');
        } finally {
            setSavingName(false);
        }
    };

    const handleDeleteConnection = async (questionId: number) => {
        setDeleteError(null);
        setDeletingId(questionId);
        try {
            await axios.delete(`/api/department_question?department_id=${departmentId}&question_id=${questionId}`);
            setConnectedQuestions((prev) => prev.filter((q) => q.id !== questionId));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || 'Fehler beim Entfernen der Frage.');
        } finally {
            setDeletingId(null);
        }
    };

    const openAddModal = () => {
        setAddingModalOpen(true);
    };

    const closeAddModal = () => {
        setAddingModalOpen(false);
    };

    const handleAddQuestions = async (selectedIds: number[]) => {
        // Add multiple questions at once
        // POST /api/department_question for each selectedId
        // Then update connectedQuestions
        if (!department) return;
        const depId = department.id;
        try {
            await Promise.all(selectedIds.map(qid => axios.post('/api/department_question', {
                department_id: depId,
                question_id: qid
            })));

            // Now we must update connectedQuestions with the newly added ones
            const newConnected = allQuestions.filter(q => selectedIds.includes(q.id));
            setConnectedQuestions((prev) => [...prev, ...newConnected]);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            throw new Error(error.response?.data?.error || 'Fehler beim Hinzufügen der Fragen.');
        }
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}

            {department && (
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Abteilung Detail</h1>
                    {departmentError && <p className="text-red-500">{departmentError}</p>}
                    {editMode ? (
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <Button onClick={handleNameSave} disabled={savingName}>
                                {savingName ? 'Speichere...' : 'Speichern'}
                            </Button>
                            <Button onClick={() => {
                                setEditMode(false);
                                setNewName(department.name);
                            }} disabled={savingName} className="bg-gray-300 hover:bg-gray-400">
                                Abbrechen
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <p className="text-lg">{department.name}</p>
                            <Button onClick={() => setEditMode(true)}>Bearbeiten</Button>
                        </div>
                    )}
                </div>
            )}

            <h2 className="text-xl font-semibold mt-8">Verbundene Fragen</h2>
            <QuestionFilter
                subcategories={subcategories}
                onFilterChange={(newFilters) => setFilters(newFilters)}
            />
            <Button onClick={openAddModal}>Frage hinzufügen</Button>

            <QuestionTable
                questions={filteredQuestions}
                loading={loading}
                showEdit={false}
                deletingId={deletingId}
                onEdit={() => {
                }}
                // no direct edit of question details here, it's just a connection removal
                // If needed to edit question text, do it in questions page not here.
                onDelete={handleDeleteConnection}
                emptyMessage="Keine verbundenen Fragen."
            />

            {addingModalOpen && (
                <DepartmentAddQuestionsModal
                    isOpen={addingModalOpen}
                    onClose={closeAddModal}
                    allQuestions={allQuestions}
                    connectedQuestions={connectedQuestions}
                    subcategories={subcategories}
                    onAdd={handleAddQuestions}
                />
            )}
        </div>
    );
};

export default DepartmentDetailPage;
