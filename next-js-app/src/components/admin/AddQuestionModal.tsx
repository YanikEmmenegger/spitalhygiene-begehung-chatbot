'use client';

import {FC, useEffect, useState} from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import axios from "axios";

interface AddQuestionsModalProps {
    departmentId: string;
    onClose: () => void;
    refreshQuestions: () => void;
    existingQuestions: number[]; // IDs of questions already connected
}

interface Question {
    id: number;
    question: string;
    subcategory: { name: string; category: { name: string } };
}

const AddQuestionsModal: FC<AddQuestionsModalProps> = ({
                                                           departmentId,
                                                           onClose,
                                                           refreshQuestions,
                                                           existingQuestions,
                                                       }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [addingId, setAddingId] = useState<number | null>(null);

    const fetchAvailableQuestions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/questions?exclude=${existingQuestions.join(";")}&search=${searchTerm}`
            );
            setQuestions(response.data.data || []);
        } catch {
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = async (questionId: number) => {
        setAddingId(questionId);
        try {
            await axios.post(`/api/department_question`, {
                department_id: departmentId,
                question_id: questionId,
            });
            refreshQuestions();
            onClose(); // Close modal after adding
        } catch (e) {
            console.log(e)
            console.error("Fehler beim Hinzufügen der Frage.");
        } finally {
            setAddingId(null);
        }
    };

    useEffect(() => {
        fetchAvailableQuestions();
    }, [searchTerm]);

    return (
        <Modal isOpen onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Frage hinzufügen</h2>
            <input
                type="text"
                placeholder="Frage suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded mb-4 w-full"
            />
            {loading ? (
                <p>Lädt Fragen...</p>
            ) : (
                <ul className="space-y-2">
                    {questions.map((q) => (
                        <li
                            key={q.id}
                            className="flex justify-between items-center p-2 border rounded hover:bg-gray-100"
                        >
                            <span>
                                <strong>{q.subcategory.category.name}</strong> - {q.question}
                            </span>
                            <Button
                                onClick={() => addQuestion(q.id)}
                                disabled={addingId === q.id}
                                className="bg-lightGreen hover:bg-darkGreen"
                            >
                                {addingId === q.id ? "Hinzufügen..." : "Hinzufügen"}
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
            {!loading && questions.length === 0 && <p>Keine Fragen gefunden.</p>}
        </Modal>
    );
};

export default AddQuestionsModal;
