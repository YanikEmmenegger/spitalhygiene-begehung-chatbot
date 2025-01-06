'use client';

import {Question, ReviewItem} from "@/types";
import {useEffect, useState} from "react";
import axios from "axios";
import {useReview} from "@/context/ReviewContext";
import Modal from "@/components/Modal";
import QuestionBlock from "@/components/review/QuestionBlock";
import Button from "@/components/Button";
import {v4 as uuidv4} from "uuid";

const AddAdditionalItemsModal = () => {
    const {isModalOpen, toggleModal, addNewReviewItems, review} = useReview();

    const [categories, setCategories] = useState<{ [key: string]: Question[] }>({});
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saveButtonText, setSaveButtonText] = useState<string | React.ReactNode>("Hinzufügen");

    const fetchQuestions = async () => {
        const idsAlreadyInReview = review!.reviewItems.map((item) => item.question.id).join(";");

        setLoading(true);
        try {
            const response = await axios.get("/api/questions?exclude=" + idsAlreadyInReview);
            if (response.data.data) {
                const allQuestions: Question[] = response.data.data;
                setQuestions(allQuestions);

                const sortedCategories: { [key: string]: Question[] } = {};
                allQuestions.forEach((question: Question) => {
                    const categoryName = question.subcategory.category.name;
                    if (!sortedCategories[categoryName]) {
                        sortedCategories[categoryName] = [];
                    }
                    sortedCategories[categoryName].push(question);
                });
                setCategories(sortedCategories);
                setError(null);
            } else {
                setError("Keine Fragen gefunden.");
            }
        } catch (e) {
            console.error("Fehler beim Laden der Fragen", e);
            setError("Fehler beim Laden der Fragen.");
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestionSelection = (questionId: number) => {
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(questionId)
                ? prevSelected.filter((id) => id !== questionId)
                : [...prevSelected, questionId]
        );
    };

    const handleSave = async () => {
        setSaveButtonText("Hinzufügen....");

        const selectedFullQuestions = questions.filter((q) => selectedQuestions.includes(q.id));
        const newReviewItems: ReviewItem[] = selectedFullQuestions.map((question) => ({
            _id: uuidv4(),
            question,
            status: "not reviewed",
            comment: "",
            persons: [],
        }));

        addNewReviewItems(newReviewItems);

        setSelectedQuestions([]);
        setCategories({});
        setSaveButtonText("Hinzufügen");
        toggleModal();
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchQuestions();
        }
    }, [isModalOpen]);

    return (
        <Modal onClose={toggleModal} isOpen={isModalOpen}>
            <div className="flex flex-col h-full">
                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto p-4">
                    <h2 className="text-xl font-semibold">Zusätzliche Kontrollen hinzufügen</h2>
                    <p className="text-gray-600 mb-4">
                        Hier können zusätzliche Items hinzugefügt werden, die nicht in der Begehung enthalten sind.
                    </p>
                    {error && <p className="text-red-500">{error}</p>}
                    {loading && <p>Laden...</p>}

                    {!loading && !error && (
                        <div className="flex flex-col gap-6">
                            {questions.length > 0 && Object.entries(categories).map(([categoryName, questions]) => (
                                <div key={categoryName} className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{categoryName}</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {questions.map((question) => (
                                            <QuestionBlock
                                                key={question.id}
                                                question={question}
                                                isSelected={selectedQuestions.includes(question.id)}
                                                onClick={() => toggleQuestionSelection(question.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {questions.length === 0 && <p>Keine weiteren Fragen verfügbar.</p>}
                        </div>
                    )}
                </div>

                {/* Fixed Footer with Buttons */}

            </div>
            <div className="flex flex-col items-center justify-end gap-4 p-4 w-full  bg-white border-t sticky bottom-0">
                <Button
                    className={`w-full ${saveButtonText === "Hinzufügen" ? "bg-lightGreen" : "bg-gray-300"}`}
                    disabled={saveButtonText !== "Hinzufügen" || loading || questions.length === 0}
                    onClick={handleSave}
                >
                    {saveButtonText}
                </Button>
                <Button className="bg-transparent w-full text-lightGreen border-lightGreen border"
                        onClick={toggleModal}>
                    Abbrechen
                </Button>
            </div>
        </Modal>
    );
};

export default AddAdditionalItemsModal;
