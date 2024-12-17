'use client';

import React, { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Button from "@/components/Button";
import { Question, QUESTION_TYPES, SubCategory } from "@/types";

interface QuestionInfoProps {
    id: string;
    setError: (error: string | null) => void;
}

const QuestionInfo: FC<QuestionInfoProps> = ({ id, setError }) => {
    const [questionData, setQuestionData] = useState<Question | null>(null);
    const [newData, setNewData] = useState<{ question: string; critical: boolean; type: string; subcategory: number | "" }>({
        question: "",
        critical: false,
        type: "",
        subcategory: "",
    });
    const [categorizedSubcategories, setCategorizedSubcategories] = useState<{ [key: string]: SubCategory[] }>({});
    const [saving, setSaving] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Helper to handle Axios errors
    const handleAxiosError = (e: unknown, fallbackMessage: string): string => {
        const error = e as AxiosError<{ error: string }>;
        return error.response?.data?.error || fallbackMessage;
    };

    // Fetch question data
    const fetchQuestion = async () => {
        setError(null);
        setValidationError(null);
        try {
            const response = await axios.get(`/api/questions?id=${id}`);
            const question = response.data.data[0] as Question;

            setQuestionData(question);
            setNewData({
                question: question.question,
                critical: question.critical,
                type: question.type || "",
                subcategory: question.subcategory.id, // Extract only ID
            });
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Laden der Frage."));
        }
    };

    // Fetch subcategories and categorize them
    const fetchSubcategories = async () => {
        setError(null);
        try {
            const response = await axios.get(`/api/subcategory`);
            const subcategories: SubCategory[] = response.data.data;

            const categorized = subcategories.reduce<{ [key: string]: SubCategory[] }>(
                (acc, sub) => {
                    const categoryName = sub.category.name;
                    if (!acc[categoryName]) acc[categoryName] = [];
                    acc[categoryName].push(sub);
                    return acc;
                },
                {}
            );
            setCategorizedSubcategories(categorized);
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Laden der Subkategorien."));
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setNewData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setNewData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Save changes with validation
    const saveChanges = async () => {
        setSaving(true);
        setValidationError(null);
        setSuccessMessage(null);

        // Validation
        if (!newData.question.trim()) {
            setValidationError("Die Frage darf nicht leer sein.");
            setSaving(false);
            return;
        }

        if (!newData.subcategory) {
            setValidationError("Bitte wählen Sie eine Unterkategorie aus.");
            setSaving(false);
            return;
        }

        if (!newData.type) {
            setValidationError("Bitte wählen Sie einen Fragentyp aus.");
            setSaving(false);
            return;
        }

        try {
            await axios.put(`/api/questions`, {
                id,
                question: newData.question.trim(),
                critical: newData.critical,
                type: newData.type,
                subcategory: newData.subcategory,
            });
            setSuccessMessage("Änderungen erfolgreich gespeichert!");
            fetchQuestion();
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Speichern der Frage."));
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchQuestion();
        fetchSubcategories();
    }, [id]);

    return (
        <div className="p-4 rounded-md shadow-md bg-neutral-100 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Frageninformationen bearbeiten</h2>

            {validationError && <div className="text-red-500 mb-4">{validationError}</div>}

            {questionData ? (
                <div className="space-y-4">
                    {/* Frage */}
                    <div>
                        <label className="block text-sm font-medium">Frage</label>
                        <input
                            type="text"
                            name="question"
                            value={newData.question}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>

                    {/* Kritisch */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="critical"
                            checked={newData.critical}
                            onChange={handleChange}
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium">Kritisch</label>
                    </div>

                    {/* Typ */}
                    <div>
                        <label className="block text-sm font-medium">Fragentyp</label>
                        <select
                            name="type"
                            value={newData.type}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="">Wählen...</option>
                            {QUESTION_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subkategorie */}
                    <div>
                        <label className="block text-sm font-medium">Subkategorie</label>
                        <select
                            name="subcategory"
                            value={newData.subcategory}
                            onChange={handleChange}
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="">Wählen...</option>
                            {Object.entries(categorizedSubcategories).map(([category, subs]) => (
                                <optgroup key={category} label={category}>
                                    {subs.map((sub) => (
                                        <option key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-2 items-center">
                        <Button
                            onClick={saveChanges}
                            disabled={saving}
                            className="bg-lightGreen hover:bg-darkGreen"
                        >
                            {saving ? "Speichern..." : "Speichern"}
                        </Button>
                        {successMessage && (
                            <span className="text-green-600 text-sm">{successMessage}</span>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">Laden...</p>
            )}
        </div>
    );
};

export default QuestionInfo;
