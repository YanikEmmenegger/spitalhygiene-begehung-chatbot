'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { SubCategory, QUESTION_TYPES } from '@/types';

interface QuestionModalProps {
    isOpen: boolean; // Controls the visibility of the modal
    onClose: () => void; // Callback to close the modal
    onSave: (data: {
        question: string;
        subcategory: number;
        type: string;
        critical: boolean;
        priority: number;
        link_name: string; // Optional, but typed as a string
        link_url: string;  // Optional, but typed as a string
    }) => Promise<void>; // Callback to save question data
    subcategories: SubCategory[]; // List of available subcategories

    initialName?: string; // Initial value for question name
    initialSubcategoryId?: number; // Initial value for subcategory ID
    initialType?: string; // Initial value for question type
    initialCritical?: boolean; // Initial value for critical status
    initialPriority?: number; // Initial value for priority
    initialLinkName?: string; // Initial value for link name
    initialLinkUrl?: string; // Initial value for link URL

    loading: boolean; // Loading state for save operation
}

const QuestionModal: React.FC<QuestionModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSave,
                                                         subcategories,
                                                         initialName = '',
                                                         initialSubcategoryId = 0,
                                                         initialType = '',
                                                         initialCritical = false,
                                                         initialPriority = 0,
                                                         initialLinkName = '',
                                                         initialLinkUrl = '',
                                                         loading,
                                                     }) => {
    // Form state variables
    const [question, setQuestion] = useState(initialName);
    const [subcategoryId, setSubcategoryId] = useState<number | ''>(initialSubcategoryId || '');
    const [type, setType] = useState(initialType);
    const [critical, setCritical] = useState(initialCritical);
    const [priorityStr, setPriorityStr] = useState(String(initialPriority));
    const [linkName, setLinkName] = useState(initialLinkName);
    const [linkUrl, setLinkUrl] = useState(initialLinkUrl);
    const [error, setError] = useState<string | null>(null);

    // Reset form fields when modal opens
    useEffect(() => {
        if (isOpen) {
            setQuestion(initialName);
            setSubcategoryId(initialSubcategoryId || '');
            setType(initialType || '');
            setCritical(initialCritical);
            setPriorityStr(String(initialPriority));
            setLinkName(initialLinkName);
            setLinkUrl(initialLinkUrl);
            setError(null);
        }
    }, [
        isOpen,
        initialName,
        initialSubcategoryId,
        initialType,
        initialCritical,
        initialPriority,
        initialLinkName,
        initialLinkUrl,
    ]);

    // Group subcategories by category for dropdown grouping
    const categorizedSubs = subcategories.reduce(
        (acc: { [catName:

            string]: SubCategory[] }, sc) => {
            const catName = sc.category.name; // Group by category name
            if (!acc[catName]) acc[catName] = []; // Initialize if not present
            acc[catName].push(sc); // Add subcategory to the group
            return acc;
        },
        {}
    );

    // Handle form submission
    const handleSave = async () => {
        setError(null); // Clear any existing error messages
        if (!question.trim()) {
            setError('Fragetext darf nicht leer sein.'); // Validate question text
            return;
        }
        if (!subcategoryId) {
            setError('Bitte eine Unterkategorie auswählen.'); // Validate subcategory selection
            return;
        }
        if (!type) {
            setError('Bitte einen Fragentyp auswählen.'); // Validate type selection
            return;
        }

        // Parse priority value
        const parsedPrio = parseInt(priorityStr, 10);
        const safePrio = isNaN(parsedPrio) ? 0 : parsedPrio;

        try {
            // Call onSave with the form data
            await onSave({
                question: question.trim(),
                subcategory: subcategoryId as number,
                type,
                critical,
                priority: safePrio,
                link_name: linkName.trim(),
                link_url: linkUrl.trim(),
            });
            onClose(); // Close modal on successful save
        } catch (err) {
            setError(String(err)); // Display error message
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">
                {initialName ? 'Frage bearbeiten' : 'Neue Frage hinzufügen'}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="space-y-4">
                {/* Question text input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Fragetext</label>
                    <input
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Fragetext eingeben"
                    />
                </div>

                {/* Subcategory dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Unterkategorie</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={subcategoryId}
                        onChange={e => setSubcategoryId(Number(e.target.value) || '')}
                    >
                        <option value="">Unterkategorie auswählen</option>
                        {Object.entries(categorizedSubs).map(([catName, subs]) => (
                            <optgroup key={catName} label={catName}>
                                {subs.map(sc => (
                                    <option key={sc.id} value={sc.id}>
                                        {sc.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                {/* Type dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">Typ</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="">Typ auswählen</option>
                        {QUESTION_TYPES.map(t => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Critical checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={critical}
                        onChange={e => setCritical(e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label>Kritisch?</label>
                </div>

                {/* Priority input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Priorität</label>
                    <input
                        type="number"
                        value={priorityStr}
                        onChange={e => setPriorityStr(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. 0"
                    />
                </div>

                {/* Link name input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Link Name</label>
                    <input
                        type="text"
                        value={linkName}
                        onChange={e => setLinkName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. HYG-77"
                    />
                </div>

                {/* Link URL input */}
                <div>
                    <label className="block text-sm font-medium mb-1">Link URL</label>
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="z.B. https://example.com/docs"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-6 gap-2 items-center">
                <Button
                    onClick={onClose}
                    disabled={loading}
                    className="bg-gray-300 hover:bg-gray-400 min-w-[100px]"
                >
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
