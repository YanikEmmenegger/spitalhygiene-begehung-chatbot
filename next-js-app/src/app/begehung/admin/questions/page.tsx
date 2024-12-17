'use client';

import React, {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import QuestionTable from "@/components/admin/QuestionTable";
import Button from "@/components/Button";
import QuestionFilter from "@/components/admin/QuestionFilter";
import {Question} from "@/types";
import CreateQuestionModal from "@/components/admin/CreateQuestionModal";

const Page = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Helper to handle errors
    const handleAxiosError = (e: unknown, fallbackMessage: string): string => {
        const error = e as AxiosError<{ error: string }>;
        return error.response?.data?.error || fallbackMessage;
    };

    // Fetch all questions
    const fetchQuestions = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data.data || []);
            setFilteredQuestions(response.data.data || []); // Initially show all questions
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Laden der Fragen."));
        } finally {
            setLoading(false);
        }
    };

    // Delete a question with confirmation
    const deleteQuestion = async (id: number) => {
        setDeletingId(id);
        try {
            await axios.delete(`/api/questions?id=${id}`);
            fetchQuestions(); // Refresh the list
        } catch (e) {
            setError(handleAxiosError(e, "Fehler beim Löschen der Frage."));
        } finally {
            setDeletingId(null);
        }
    };

    // Apply filters dynamically
    const applyFilters = (filteredData: Question[]) => {
        setFilteredQuestions(filteredData);
    };

    // Open/close modal
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // Refresh question list after adding a new question
    const handleAddSuccess = () => {
        fetchQuestions();
        closeModal();
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Alle Fragen</h1>
                <Button onClick={openModal}>Neue Frage hinzufügen</Button>
            </div>

            {/* Error */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Loading */}
            {loading ? (
                <div className="animate-pulse p-4 bg-gray-100 rounded-md">
                    <p className="h-4 w-3/4 bg-gray-300 rounded mb-2"></p>
                    <p className="h-4 w-1/2 bg-gray-300 rounded"></p>
                </div>
            ) : (
                <>
                    {/* Filter Component */}
                    <QuestionFilter questions={questions} onFilter={applyFilters}/>

                    {/* Question Table */}
                    <div className="p-4 rounded-md shadow-md bg-neutral-100 border border-gray-200 mt-4">
                        {filteredQuestions.length > 0 ? (
                            <QuestionTable
                                questions={filteredQuestions}
                                deletingId={deletingId}
                                onDelete={deleteQuestion}
                            />
                        ) : (
                            <p>Keine Fragen verfügbar.</p>
                        )}
                    </div>
                </>
            )}

            {/* Add Question Modal */}
            {showModal && (
                <CreateQuestionModal
                    onClose={closeModal}
                    onAddSuccess={handleAddSuccess}
                />
            )}
        </div>
    );
};

export default Page;
