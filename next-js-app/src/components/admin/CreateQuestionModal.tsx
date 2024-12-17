'use client';

import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from 'axios';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import {SubCategory} from "@/types";

interface CreateQuestionModalProps {
    onClose: () => void;
    onAddSuccess: () => void;
}


const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({onClose, onAddSuccess}) => {
    const [questionText, setQuestionText] = useState('');
    const [type, setType] = useState<string>('');
    const [critical, setCritical] = useState<boolean>(false);
    //const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [categorizedSubcategories, setCategorizedSubcategories] = useState<{ [key: string]: SubCategory[] }>({});
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch subcategories from the endpoint
    const fetchSubcategories = async () => {
        setError(null);
        try {
            const response = await axios.get('/api/subcategory');
            const fetchedData: SubCategory[] = response.data.data;

            // Categorize subcategories based on their parent category
            const categorized = fetchedData.reduce((acc, subcat) => {
                const categoryName = subcat.category.name;
                if (!acc[categoryName]) acc[categoryName] = [];
                acc[categoryName].push(subcat);
                return acc;
            }, {} as { [key: string]: SubCategory[] });

            setCategorizedSubcategories(categorized);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || 'Fehler beim Laden der Subkategorien.');
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, []);

    // Handle question submission
    const handleSubmit = async () => {
        if (!questionText.trim() || !type || !selectedSubcategory) {
            setError('Alle Felder müssen ausgefüllt werden.');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/questions', {
                question: questionText.trim(),
                type,
                critical,
                subcategory: selectedSubcategory,
            });
            onAddSuccess(); // Refresh the question list
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            setError(error.response?.data?.error || 'Fehler beim Erstellen der Frage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">Neue Frage hinzufügen</h2>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Question Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Frage</label>
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    placeholder="Fragetext eingeben"
                />
            </div>

            {/* Question Type Dropdown */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fragentyp</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full border p-2 rounded-md"
                >
                    <option value="">Bitte wählen...</option>
                    <option value="Beobachtung">Beobachtung</option>
                    <option value="Frage Personal">Frage Personal</option>
                    <option value="Frage ärztliches Personal">Frage ärztliches Personal</option>
                    <option value="nicht anwendbar">Nicht anwendbar</option>
                </select>
            </div>

            {/* Subcategory Dropdown */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subkategorie</label>
                <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(Number(e.target.value))}
                    className="w-full border p-2 rounded-md"
                >
                    <option value="">Bitte wählen...</option>
                    {Object.entries(categorizedSubcategories).map(([categoryName, subs]) => (
                        <optgroup key={categoryName} label={categoryName}>
                            {subs.map((subcat) => (
                                <option key={subcat.id} value={subcat.id}>
                                    {subcat.name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {/* Critical Toggle */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="critical"
                    checked={critical}
                    onChange={(e) => setCritical(e.target.checked)}
                    className="w-4 h-4"
                />
                <label htmlFor="critical" className="text-sm font-medium text-gray-700">
                    Kritische Frage?
                </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 justify-end">
                <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
                    Abbrechen
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Speichern...' : 'Frage hinzufügen'}
                </Button>
            </div>
        </Modal>
    );
};

export default CreateQuestionModal;
