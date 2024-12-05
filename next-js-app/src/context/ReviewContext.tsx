import React, {createContext, useContext, useEffect, useState} from "react";
import {Person, ResultColor, Review, ReviewItem, ReviewItemStatusOptions,} from "@/types"; // Ensure this imports the updated types
import {getReviewById, updateReview} from "@/indexedDB/indexedDBService";
import AddAdditionalItemsModal from "@/components/review/AddAdditionalItemsModal";

interface ReviewContextProps {
    review: Review | null;
    isModalOpen: boolean;
    sortedCategories: { [key: string]: ReviewItem[] };
    updateReviewItemStatus: (itemId: number, newStatus: ReviewItemStatusOptions) => void;
    updateResult: (reviewData: Review) => void;
    updateComment: (itemId: number, newComment: string) => void;
    addPersonToReviewItem: (itemId: string, _person: Person) => void;
    deletePersonFromReviewItem: (itemId: string, _person: Person) => void;
    toggleModal: () => void;
    addNewReviewItems: (newReviewItems: ReviewItem[]) => void;
    setReviewToComplete: () => void;
}

const ReviewContext = createContext<ReviewContextProps | undefined>(undefined);

export const ReviewProvider: React.FC<{ reviewID: string; children: React.ReactNode }> = ({
                                                                                              reviewID,
                                                                                              children,
                                                                                          }) => {
    const [review, setReview] = useState<Review | null>(null);
    const [sortedCategories, setSortedCategories] = useState<{ [key: string]: ReviewItem[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const fetchedReview = await getReviewById(reviewID);
                if (fetchedReview) {
                    setReview(fetchedReview);
                    sortQuestionsByCategory(fetchedReview);
                    updateResult(fetchedReview);
                } else {
                    console.log("Begehung nicht gefunden.");
                }
            } catch (e) {
                console.log("Fehler beim Abrufen der Begehung.", e);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [reviewID]);

    // Auto-save to IndexedDB whenever `review` changes
    useEffect(() => {
        if (review) {
            const saveReviewToDB = async () => {
                try {
                    await updateReview(review);
                    console.log("Review saved to IndexedDB");
                } catch (e) {
                    console.error("Failed to save review to IndexedDB", e);
                }
            };
            saveReviewToDB();
        }
    }, [review]);

    const sortQuestionsByCategory = (reviewData: Review) => {
        const categories: { [key: string]: ReviewItem[] } = {};

        reviewData.reviewItems.forEach((item) => {
            const categoryName = item.question.subcategory.category.name;
            if (!categories[categoryName]) {
                categories[categoryName] = [];
            }
            categories[categoryName].push(item);
        });

        setSortedCategories(categories);
    };

    const addNewReviewItems = (newReviewItems: ReviewItem[]) => {
        if (review) {
            const updatedReviewItems = [...review.reviewItems, ...newReviewItems];
            const updatedReview = {...review, reviewItems: updatedReviewItems};
            setReview(updatedReview);
            sortQuestionsByCategory(updatedReview);
            updateResult(updatedReview);
        }
    };

    const updateReviewItemStatus = (itemId: number, newStatus: ReviewItemStatusOptions) => {
        if (review) {
            const updatedReviewItems: ReviewItem[] = review.reviewItems.map((item) =>
                item.question.id === itemId ? {...item, status: newStatus} : item
            );
            const updatedReview = {...review, reviewItems: updatedReviewItems};
            setReview(updatedReview);
            sortQuestionsByCategory(updatedReview);
            updateResult(updatedReview);
        }
    };

    const updateComment = (itemId: number, newComment: string) => {
        if (review) {
            const updatedReviewItems: ReviewItem[] = review.reviewItems.map((item) =>
                item.question.id === itemId ? {...item, comment: newComment} : item
            );
            const updatedReview = {...review, reviewItems: updatedReviewItems};
            setReview(updatedReview);
            sortQuestionsByCategory(updatedReview);
            updateResult(updatedReview);
        }
    };

    const addPersonToReviewItem = (itemId: string, _person: Person) => {
        if (review) {
            const updatedReviewItems = review.reviewItems.map((item) => {
                if (item._id === itemId) {
                    return {
                        ...item,
                        persons: [...item.persons, _person],
                    };
                }
                return item;
            });

            const updatedReview = {...review, reviewItems: updatedReviewItems};
            setReview(updatedReview);
            sortQuestionsByCategory(updatedReview);
            updateResult(updatedReview);
        }
    };

    const deletePersonFromReviewItem = (itemId: string, _person: Person) => {
        if (review) {
            const updatedReviewItems = review.reviewItems.map((item) => {
                if (item._id === itemId) {
                    return {
                        ...item,
                        persons: item.persons.filter((person) => person.id !== _person.id),
                    };
                }
                return item;
            });

            const updatedReview = {...review, reviewItems: updatedReviewItems};
            setReview(updatedReview);
            sortQuestionsByCategory(updatedReview);
            updateResult(updatedReview);
        }
    };

    const setReviewToComplete = () => {
        if (review) {
            const updatedReview: Review = {...review, status: "complete"};
            setReview(updatedReview);
        }
    };

    const updateResult = (reviewData: Review) => {
        if (review) {
            // Calculate the result of the review based on approved items
            const approvedItems = reviewData.reviewItems.filter((item) => item.status === "approved")
                .length;
            const partiallyApprovedItems = reviewData.reviewItems.filter(
                (item) => item.status === "partially approved"
            ).length;
            const notReviewedItems = reviewData.reviewItems.filter(
                (item) => item.status === "not reviewed"
            ).length;

            const totalItems = reviewData.reviewItems.length - notReviewedItems;
            const resultPercentage =
                totalItems > 0
                    ? Math.round(((approvedItems + partiallyApprovedItems) / totalItems) * 100)
                    : 0;

            // Get critical review items that are failed
            const criticalFailedItems = reviewData.reviewItems.filter(
                (item) => item.question.critical && item.status === "failed"
            ).length;

            let resultColor: ResultColor =
                resultPercentage < 60 ? "red" : resultPercentage < 80 ? "yellow" : "green";
            let _resultDescription: string | null;

            if (criticalFailedItems === 0) {
                _resultDescription = "Alle Hauptkritikpunkte erfüllt";
            } else if (criticalFailedItems >= 1 && criticalFailedItems <= 3) {
                if (resultColor === "green") {
                    resultColor = "yellow";
                }
                _resultDescription = `${criticalFailedItems} Hauptkritikpunkte nicht erfüllt`;
            } else {
                resultColor = "red";
                _resultDescription = `${criticalFailedItems} Hauptkritikpunkte nicht erfüllt`;
            }

            const newFields: Partial<Review> = {
                result: resultColor,
                resultPercentage: resultPercentage,
                criticalCount: criticalFailedItems,
                resultDescription: _resultDescription,
            };

            // Update the review with the result data
            setReview({
                ...reviewData,
                ...newFields,
            });
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <ReviewContext.Provider
            value={{
                review,
                sortedCategories,
                updateReviewItemStatus,
                updateResult,
                updateComment,
                addPersonToReviewItem,
                toggleModal,
                isModalOpen,
                setReviewToComplete,
                deletePersonFromReviewItem,
                addNewReviewItems,
            }}
        >
            {loading && <p className="text-center text-gray-500">Lade...</p>}
            {!loading && review ? children : <p>Begehung nicht gefunden.</p>}
            <AddAdditionalItemsModal/>
        </ReviewContext.Provider>
    );
};

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error("useReview must be used within a ReviewProvider");
    }
    return context;
};
