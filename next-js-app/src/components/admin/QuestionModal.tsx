'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { SubCategory } from '@/types';
import { QUESTION_TYPES } from '@/types';

interface QuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { question: string; subcategory: number; type: string; critical: boolean }) => Promise<void>;
    subcategories: SubCategory[];
    initialName?: string;
    initialSubcategoryId?: number;
    initialType?: string;
    initialCritical?: boolean;
    loading: boolean;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSave,
                                                         subcategories,
                                                         initialName = '',
                                                         initialSubcategoryId,
                                                         initialType = '',
                                                         initialCritical = false,
                                                         loading,
                                                     }) => {
    const [question, setQuestion] = useState(initialName);
    const [subcategoryId, setSubcategoryId] = useState<number | ''>(initialSubcategoryId || '');
    const [type, setType] = useState(initialType);
    const [critical, setCritical] = useState(initialCritical);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setQuestion(initialName);
            setSubcategoryId(initialSubcategoryId || '');
            setType(initialType || '');
            setCritical(initialCritical);
            setError(null);
        }
    }, [isOpen, initialName, initialSubcategoryId, initialType, initialCritical]);

    // Group subcategories by category for optgroup
    const categorizedSubs = subcategories.reduce((acc: { [catName: string]: SubCategory[] }, sc) => {
        const catName = sc.category.name;
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(sc);
        return acc;
    }, {});

    const handleSave = async () => {
        setError(null);
        if (!question.trim()) {
            setError('Fragetext darf nicht leer sein.');
            return;
        }
        if (!subcategoryId) {
            setError('Bitte eine Unterkategorie auswählen.');
            return;
        }
        if (!type) {
            setError('Bitte einen Fragentyp auswählen.');
            return;
        }

        try {
            await onSave({
                question: question.trim(),
                subcategory: subcategoryId as number,
                type,
                critical,
            });
            onClose(); // Close on success
        } catch (err) {
            setError(String(err));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                {initialName ? 'Frage bearbeiten' : 'Neue Frage hinzufügen'}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Fragetext</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Fragetext eingeben"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Unterkategorie</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={subcategoryId}
                        onChange={(e) => setSubcategoryId(Number(e.target.value) || '')}
                    >
                        <option value="">Unterkategorie auswählen</option>
                        {Object.entries(categorizedSubs).map(([catName, subs]) => (
                            <optgroup key={catName} label={catName}>
                                {subs.map((sc) => (
                                    <option key={sc.id} value={sc.id}>
                                        {sc.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Typ</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Typ auswählen</option>
                        {QUESTION_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={critical}
                        onChange={(e) => setCritical(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label>Kritisch?</label>
                </div>
            </div>
            <div className="flex justify-end mt-6 gap-2 items-center">
                <Button onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400 min-w-[100px]">
                    Abbrechen
                </Button>
                <Button onClick={handleSave} disabled={loading} className="min-w-[100px]">
                    {loading ? 'Speichern...' : 'Speichern'}
                </Button>
            </div>
        </Modal>
    );
};

export default QuestionModal;
