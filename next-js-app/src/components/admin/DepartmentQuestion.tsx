'use client';

import { FC, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Button from "@/components/Button";
import QuestionTable from "@/components/admin/QuestionTable";
import AddQuestionsModal from "@/components/admin/AddQuestionModal";
import {Question} from "@/types";

interface DepartmentQuestionsProps {
    departmentId: string;
    setError: (error: string | null) => void;
}

const DepartmentQuestions: FC<DepartmentQuestionsProps> = ({ departmentId, setError }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchQuestions = async () => {
        setError(null);
        try {
            const response = await axios.get(`/api/questions?department=${departmentId}`);
            setQuestions(response.data.data || []);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            console.error(error);
            setError("Fehler beim Laden der Fragen.");
        }
    };

    const unlinkQuestion = async (questionId: number) => {
        setDeletingId(questionId);
        try {
            await axios.delete(`/api/department_question?department_id=${departmentId}&question_id=${questionId}`);
        } catch (e) {
            const error = e as AxiosError<{ error: string }>;
            console.error(error);
            setError("Fehler beim Entfernen der Frage.");
        } finally {
            fetchQuestions().then(() => setDeletingId(null));
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="p-4 rounded-md shadow-md bg-neutral-100 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Verbundene Fragen</h2>
            {questions.length > 0 ? (
                <QuestionTable
                    questions={questions}
                    deletingId={deletingId}
                    onDelete={unlinkQuestion}
                />
            ) : (
                <p>Keine verbundenen Fragen.</p>
            )}
            <Button className="mt-4" onClick={() => setShowModal(true)}>
                Frage hinzufügen
            </Button>
            {showModal && (
                <AddQuestionsModal
                    departmentId={departmentId}
                    onClose={() => setShowModal(false)}
                    refreshQuestions={fetchQuestions}
                    existingQuestions={questions.map((q) => q.id)} // Exclude already added questions
                />
            )}
        </div>
    );
};

export default DepartmentQuestions;
