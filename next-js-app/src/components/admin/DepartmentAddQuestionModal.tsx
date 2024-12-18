'use client';

import React, {useEffect, useMemo, useState} from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import {Question, SubCategory} from '@/types';
import QuestionFilter from '@/components/admin/QuestionFilter';
import {AxiosError} from "axios";

interface Filters {
    search?: string;
    category?: number;
    subcategory?: number;
    critical?: boolean;
}

interface DepartmentAddQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    allQuestions: Question[];
    connectedQuestions: Question[];
    subcategories: SubCategory[];
    onAdd: (selectedIds: number[]) => Promise<void>;
}

const DepartmentAddQuestionsModal: React.FC<DepartmentAddQuestionsModalProps> = ({
                                                                                     isOpen,
                                                                                     onClose,
                                                                                     allQuestions,
                                                                                     connectedQuestions,
                                                                                     subcategories,
                                                                                     onAdd
                                                                                 }) => {
    const [filters, setFilters] = useState<Filters>({});
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [modalError, setModalError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Memoize disconnectedQuestions so it's stable and doesn't change every render
    const disconnectedQuestions = useMemo(() => {
        const connectedIds = connectedQuestions.map(q => q.id);
        return allQuestions.filter(q => !connectedIds.includes(q.id));
    }, [allQuestions, connectedQuestions]);

    // const hasFilters = () => {
    //     return !!(filters.search?.trim() || filters.category || filters.subcategory || filters.critical);
    // };

    const applyLocalFilters = (): Question[] => {
        let filtered = [...disconnectedQuestions];

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

        return filtered;
    };

    useEffect(() => {
        if (isOpen) {
            setFilters({});
            setSelectedIds([]);
            setModalError(null);
            setLoading(false);
        }
    }, [isOpen]);

    // Re-run filtering whenever filters or disconnectedQuestions change
    useEffect(() => {
        const result = applyLocalFilters();
        setFilteredQuestions(result);
    }, [filters, disconnectedQuestions]);

    const handleSelect = (qId: number) => {
        setSelectedIds(prev => prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]);
    };

    const handleAdd = async () => {
        if (selectedIds.length === 0) {
            setModalError('Bitte wählen Sie mindestens eine Frage aus.');
            return;
        }
        setLoading(true);
        setModalError(null);
        try {
            await onAdd(selectedIds);
            onClose();
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setModalError(error.response?.data?.error || 'Fehler beim Hinzufügen der Fragen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal size="large" isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">Fragen hinzufügen</h2>
            {modalError && <p className="text-red-500 mb-4">{modalError}</p>}

            <QuestionFilter
                subcategories={subcategories}
                onFilterChange={(f) => setFilters(f)}
            />

            <div className="max-h-64 overflow-auto border p-2 rounded mb-4">
                {filteredQuestions.length === 0 ? (
                    <p className="text-gray-500 text-center">Keine verfügbaren Fragen.</p>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border-b"></th>
                            <th className="p-2 border-b text-left">Name</th>
                            <th className="p-2 border-b text-left">Kategorie</th>
                            <th className="p-2 border-b text-left">Unterkategorie</th>
                            <th className="p-2 border-b text-left">Typ</th>
                            <th className="p-2 border-b text-left">Kritisch</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredQuestions.map(q => (
                            <tr key={q.id} className="hover:bg-gray-50">
                                <td className="p-2 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(q.id)}
                                        onChange={() => handleSelect(q.id)}
                                    />
                                </td>
                                <td className="p-2 border-b">{q.question}</td>
                                <td className="p-2 border-b">{q.subcategory.category.name}</td>
                                <td className="p-2 border-b">{q.subcategory.name}</td>
                                <td className="p-2 border-b">{q.type || 'N/A'}</td>
                                <td className="p-2 border-b">{q.critical ? 'Ja' : 'Nein'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <Button onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleAdd} disabled={loading || selectedIds.length === 0}>
                    {loading ? 'Hinzufügen...' : selectedIds.length > 0 ? `Hinzufügen (${selectedIds.length})` : 'Auswählen'}
                </Button>
            </div>
        </Modal>
    );
};

export default DepartmentAddQuestionsModal;