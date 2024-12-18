'use client';

import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Button from '@/components/Button';
import {Question, QUESTION_TYPES, QuestionTypesEnum, SubCategory} from '@/types';
import QuestionModal from "@/components/admin/QuestionModal";
import QuestionFilter from "@/components/admin/QuestionFilter";
import QuestionTable from "@/components/admin/QuestionTable"; // newly created component

interface Filters {
    search?: string;
    category?: number;
    subcategory?: number;
    critical?: boolean;
}

const QuestionPage = () => {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [pageError, setPageError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [filters, setFilters] = useState<Filters>({});

    // Check if any filter is active
    const hasFilters = () => {
        return filters.search?.trim() || filters.category || filters.subcategory || filters.critical;
    };

    const applyLocalFilters = () => {
        let filtered = [...allQuestions];

        if (!hasFilters()) {
            setQuestions(allQuestions);
            return;
        }

        // search by question text
        if (filters.search && filters.search.trim()) {
            const searchLower = filters.search.trim().toLowerCase();
            filtered = filtered.filter(q => q.question.toLowerCase().includes(searchLower));
        }

        if (filters.critical) {
            filtered = filtered.filter(q => q.critical);
        }

        if (filters.subcategory) {
            filtered = filtered.filter(q => q.subcategory.id === filters.subcategory);
        } else if (filters.category) {
            filtered = filtered.filter(q => q.subcategory.category.id === filters.category);
        }

        setQuestions(filtered);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setPageError(null);
            try {
                // Fetch all questions without any search
                // and all subcategories once
                const [qRes, scRes] = await Promise.all([
                    axios.get('/api/questions'), // no search param
                    axios.get('/api/subcategory'),
                ]);

                const fetchedQuestions: Question[] = qRes.data.data || [];
                const fetchedSubcategories: SubCategory[] = scRes.data.data || [];

                // Validate question types
                for (const q of fetchedQuestions) {
                    if (!q.type || !QUESTION_TYPES.includes(q.type)) {
                        q.type = null;
                    }
                }

                setAllQuestions(fetchedQuestions);
                setSubcategories(fetchedSubcategories);
                // Initially no filters, show all directly
                setQuestions(fetchedQuestions);
            } catch (err) {
                console.log(err);
                setPageError('Fehler beim Laden von Fragen oder Unterkategorien.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!hasFilters()) {
            setQuestions(allQuestions);
        } else {
            applyLocalFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, allQuestions]);

    const saveQuestion = (data: { question: string; subcategory: number; type: string; critical: boolean }) => {
        return new Promise<void>(async (resolve, reject) => {
            setSaving(true);
            try {
                let qType: QuestionTypesEnum | null = null;
                if (QUESTION_TYPES.includes(data.type)) {
                    qType = data.type as QuestionTypesEnum;
                } else {
                    qType = null;
                }

                if (editingQuestion) {
                    // Update existing question
                    await axios.put('/api/questions', {
                        id: editingQuestion.id,
                        question: data.question,
                        critical: data.critical,
                        subcategory: data.subcategory,
                        type: qType,
                    });

                    setAllQuestions((prev) =>
                        prev.map((q) =>
                            q.id === editingQuestion.id
                                ? {
                                    ...q,
                                    question: data.question,
                                    critical: data.critical,
                                    type: qType,
                                    subcategory: subcategories.find((sc) => sc.id === data.subcategory)!,
                                }
                                : q
                        )
                    );
                } else {
                    // Create new question
                    const response = await axios.post('/api/questions', {
                        question: data.question,
                        critical: data.critical,
                        subcategory: data.subcategory,
                        type: qType,
                    });
                    const newQ = {
                        ...response.data.data[0],
                        subcategory: subcategories.find((sc: SubCategory) => sc.id === data.subcategory)!,
                        type: qType,
                    };
                    setAllQuestions((prev) => [...prev, newQ]);
                }
                resolve();
            } catch (e) {
                const error = e as AxiosError<{ error: string }>;
                const errorMsg = error.response?.data?.error || 'Fehler beim Speichern der Frage.';
                reject(errorMsg);
            } finally {
                setSaving(false);
            }
        });
    };

    const handleDelete = async (id: number) => {
        setDeleteError(null);
        setDeletingId(id);
        try {
            await axios.delete(`/api/questions?id=${id}`);
            setAllQuestions((prev) => prev.filter((q) => q.id !== id));
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setDeleteError(error.response?.data?.error || 'Fehler beim Löschen der Frage.');
        } finally {
            setDeletingId(null);
        }
    };

    const openModal = (question?: Question) => {
        setEditingQuestion(question || null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingQuestion(null);
    };

    return (
        <div className="container mx-auto py-4 space-y-6">
            <h1 className="text-2xl font-bold">Fragen</h1>
            {pageError && <p className="text-red-500">{pageError}</p>}
            {deleteError && <p className="text-red-500">{deleteError}</p>}

            <QuestionFilter
                subcategories={subcategories}
                onFilterChange={(newFilters) => setFilters(newFilters)}
            />

            <Button onClick={() => openModal()}>Neue Frage hinzufügen</Button>

            <QuestionTable
                questions={questions}
                loading={loading}
                deletingId={deletingId}
                onEdit={openModal}
                onDelete={handleDelete}
            />

            {modalOpen && (
                <QuestionModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    onSave={saveQuestion}
                    subcategories={subcategories}
                    initialName={editingQuestion?.question}
                    initialSubcategoryId={editingQuestion?.subcategory.id}
                    initialType={editingQuestion?.type || ''}
                    initialCritical={editingQuestion?.critical || false}
                    loading={saving}
                />
            )}
        </div>
    );
};

export default QuestionPage;
