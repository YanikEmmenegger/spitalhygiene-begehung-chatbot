'use client';

// Imports necessary types, hooks, and components
import {Question, ReviewItem} from "@/types"; // Types for questions and review items
import {useEffect, useState} from "react"; // React hooks for state management and side effects
import axios from "axios"; // HTTP client for API requests
import {useReview} from "@/context/ReviewContext"; // Custom hook for review context
import Modal from "@/components/Modal"; // Modal component for displaying additional items
import QuestionBlock from "@/components/review/QuestionBlock"; // UI block for displaying questions
import Button from "@/components/Button"; // Button component
import {v4 as uuidv4} from "uuid"; // UUID generator for unique identifiers

// Component for adding additional review items
const AddAdditionalItemsModal = () => {
    // Extracts context values and functions from the review context
    const {isModalOpen, toggleModal, addNewReviewItems, review} = useReview();

    // State variables for managing data and UI states
    const [categories, setCategories] = useState<{ [key: string]: Question[] }>({}); // Grouped questions by category
    const [questions, setQuestions] = useState<Question[]>([]); // List of all questions
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]); // IDs of selected questions
    const [error, setError] = useState<string | null>(null); // Error message
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [saveButtonText, setSaveButtonText] = useState<string | React.ReactNode>("Hinzufügen"); // Text for save button

    // Fetches questions from the API, excluding already included ones
    const fetchQuestions = async () => {
        const idsAlreadyInReview = review!.reviewItems.map((item) => item.question.id).join(";"); // Collects IDs of existing review items

        setLoading(true); // Sets loading state to true
        try {
            const response = await axios.get("/api/questions?exclude=" + idsAlreadyInReview); // API call to fetch questions
            if (response.data.data) {
                const allQuestions: Question[] = response.data.data; // Extracts questions from response
                setQuestions(allQuestions); // Updates questions state

                // Groups questions by category
                const sortedCategories: { [key: string]: Question[] } = {};
                allQuestions.forEach((question: Question) => {
                    const categoryName = question.subcategory.category.name;
                    if (!sortedCategories[categoryName]) {
                        sortedCategories[categoryName] = [];
                    }
                    sortedCategories[categoryName].push(question);
                });
                setCategories(sortedCategories); // Updates categories state
                setError(null); // Clears error state
            } else {
                setError("Keine Fragen gefunden."); // Sets error message if no questions found
            }
        } catch (e) {
            console.error("Fehler beim Laden der Fragen", e); // Logs error to console
            setError("Fehler beim Laden der Fragen."); // Sets error message
        } finally {
            setLoading(false); // Sets loading state to false
        }
    };

    // Toggles the selection of a question by ID
    const toggleQuestionSelection = (questionId: number) => {
        setSelectedQuestions((prevSelected) =>
            prevSelected.includes(questionId)
                ? prevSelected.filter((id) => id !== questionId) // Removes ID if already selected
                : [...prevSelected, questionId] // Adds ID if not selected
        );
    };

    // Saves selected questions as new review items
    const handleSave = async () => {
        setSaveButtonText("Hinzufügen...."); // Updates save button text

        const selectedFullQuestions = questions.filter((q) => selectedQuestions.includes(q.id)); // Filters selected questions
        const newReviewItems: ReviewItem[] = selectedFullQuestions.map((question) => ({
            _id: uuidv4(), // Generates unique ID
            question,
            status: "not reviewed", // Default status
            comment: "", // Empty comment
            persons: [], // Empty persons array
        }));

        addNewReviewItems(newReviewItems); // Adds new review items to the review

        // Resets state and closes modal
        setSelectedQuestions([]);
        setCategories({});
        setSaveButtonText("Hinzufügen");
        toggleModal();
    };

    // Fetches questions when the modal is opened
    useEffect(() => {
        if (isModalOpen) {
            fetchQuestions();
        }
    }, [isModalOpen]);

    return (
        // Modal for adding additional items
        <Modal onClose={toggleModal} isOpen={isModalOpen}>
            <div className="flex flex-col h-full">
                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto p-4">
                    <h2 className="text-xl font-semibold">Zusätzliche Kontrollen hinzufügen</h2>
                    <p className="text-gray-600 mb-4">
                        Hier können zusätzliche Items hinzugefügt werden, die nicht in der Begehung enthalten sind.
                    </p>
                    {error && <p className="text-red-500">{error}</p>} {/* Displays error message */}
                    {loading && <p>Laden...</p>} {/* Displays loading indicator */}

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
                                                isSelected={selectedQuestions.includes(question.id)} // Checks if selected
                                                onClick={() => toggleQuestionSelection(question.id)} // Toggles selection
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {questions.length === 0 && <p>Keine weiteren Fragen verfügbar.</p>} {/* No questions message */}
                        </div>
                    )}
                </div>

                {/* Fixed Footer with Buttons */}
                <div className="flex flex-col items-center justify-end gap-4 p-4 w-full bg-white border-t sticky bottom-0">
                    <Button
                        className={`w-full ${saveButtonText === "Hinzufügen" ? "bg-lightGreen" : "bg-gray-300"}`}
                        disabled={saveButtonText !== "Hinzufügen" || loading || questions.length === 0} // Disable under conditions
                        onClick={handleSave} // Calls save function
                    >
                        {saveButtonText}
                    </Button>
                    <Button className="bg-transparent w-full text-lightGreen border-lightGreen border"
                            onClick={toggleModal}>
                        Abbrechen
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AddAdditionalItemsModal;
