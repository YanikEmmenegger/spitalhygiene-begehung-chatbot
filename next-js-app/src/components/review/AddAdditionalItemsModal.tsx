'use client';

import {Question, ReviewItem} from "@/types"; // Ensure this imports the updated types with `id: number`
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
    const [questions, setQuestions] = useState<Question[]>([]); // Store all questions in a flat array
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]); // Changed from `string[]` to `number[]`
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saveButtonText, setSaveButtonText] = useState<string | React.ReactNode>("Hinzufügen");

    // Fetch and sort questions into categories
    const fetchQuestions = async () => {
        // Get all IDs of questions that are already in the review
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

    // Toggle question selection
    const toggleQuestionSelection = (questionId: number) => {
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(questionId)
                ? prevSelected.filter((id) => id !== questionId)
                : [...prevSelected, questionId]
        );
    };

    const handleSave = async () => {
        setSaveButtonText("Hinzufügen....");

        // Map selected question IDs to full Question objects
        const selectedFullQuestions = questions.filter((q) => selectedQuestions.includes(q.id));

        // Convert selected Questions into ReviewItems
        const newReviewItems: ReviewItem[] = selectedFullQuestions.map((question) => ({
            _id: uuidv4(),
            question, // Full Question object
            status: "not reviewed",
            comment: "",
            persons: [],
        }));

        // Add the new review items to the context
        addNewReviewItems(newReviewItems);

        // Reset the modal
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
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Zusätzliche Kontrollen hinzufügen</h2>
                <p className="text-gray-600">
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
                <Button
                    disabled={saveButtonText !== "Hinzufügen" || loading || questions.length === 0}
                    onClick={handleSave}
                >
                    {saveButtonText}
                </Button>
                <Button className={"bg-transparent text-lightGreen border-lightGreen border"} onClick={toggleModal}>
                    Abbrechen
                </Button>
            </div>
        </Modal>
    );
};

export default AddAdditionalItemsModal;
