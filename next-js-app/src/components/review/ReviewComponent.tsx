'use client';
import {FC} from "react";
import {ReviewProvider, useReview} from "@/context/ReviewContext";
import Button from "@/components/Button";
import CategoryComponent from "@/components/review/CategoryComponent";
import {twMerge} from "tailwind-merge";
import CompleteButton from "@/components/review/CompleteButton";
import SendReviewButton from "@/components/review/SendReviewButton";
import Link from "next/link";
import {getDisplayNameofDate} from "@/utils/dateFormat";

interface ReviewComponentProps {
    reviewID: string; // The ID of the review to display
}

// The main component that wraps the review content in a context provider
const ReviewComponent: FC<ReviewComponentProps> = ({reviewID}) => {
    return (
        <ReviewProvider reviewID={reviewID}>
            <div className="flex justify-center w-full">
                <InnerReviewComponent/>
            </div>
        </ReviewProvider>
    );
};

// Inner component for displaying and interacting with a review
const InnerReviewComponent: FC = () => {
    const {review, sortedCategories, toggleModal, setReviewToComplete} = useReview();

    // Display loading message if the review is not yet available
    if (!review) {
        return <p className="text-center text-gray-500">Lade...</p>;
    }

    // Handle completion of the review
    const handleSubmit = () => {
        // Check if all questions are answered
        const notReviewed = review.reviewItems.filter((item) => item.status === 'not reviewed').length;
        if (notReviewed > 0) {
            alert("Bitte alle Fragen beantworten"); // Alert user if there are unanswered questions
            return;
        } else {
            setReviewToComplete(); // Mark review as complete if all questions are answered
        }
    };

    return (
        <div className={twMerge("w-full mb-20 mt-5 max-w-2xl bg-white")}>
            {/* Review header */}
            <div className={twMerge("flex flex-col gap-2", review.status === 'complete' ? "opacity-80" : "opacity-100")}>
                <div className="flex border-b-2 mx-2 pb-5 border-neutral-300 justify-between">
                    <div>
                        {/* Display review details */}
                        <p className="text-gray-600 font-semibold">
                            Begehung vom: <span className="text-gray-800">{getDisplayNameofDate(review.date)}</span>
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Abteilung:</span> {review.department.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Geprüft von: </span>{review.reviewer.split("@")[0].split(".").join(" ")}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Prozent: </span>{review.resultPercentage}%
                        </p>
                        {review.result && (
                            <p className="text-gray-600">
                                <span className="font-semibold">Ampel: </span>
                                {review.result === "green" ? "🟢" : review.result === "yellow" ? "🟡" : "🔴"}
                            </p>
                        )}
                        {review.resultDescription && (
                            <p className="text-gray-600">
                                <span className="font-semibold">Hauptabweichungen: </span>{review.resultDescription}
                            </p>
                        )}
                    </div>
                    <div className="flex items-end">
                        {/* Display review status */}
                        <span>
                            {review.status === "complete" ? (
                                <p className="text-lightGreen">Abgeschlossen</p>
                            ) : (
                                <p className="text-amber-500">In Bearbeitung</p>
                            )}
                        </span>
                    </div>
                </div>

                {/* Render categories */}
                <div>
                    {Object.entries(sortedCategories).map(([categoryName]) => (
                        <CategoryComponent key={categoryName} categoryName={categoryName}/>
                    ))}
                </div>

                {/* Button to add additional questions */}
                <Button onClick={toggleModal}
                        className={twMerge("w-full bg-transparent border border-lightGreen text-lightGreen text-xl font-medium", review.status === 'complete' && "hidden")}>
                    Zusätzliche Fragen
                </Button>

                {/* Button to complete the review */}
                <CompleteButton disabled={review.status === 'complete'} onClick={handleSubmit}/>
            </div>

            {/* Button to navigate back to the homepage */}
            <Link href={"/begehung"}>
                <Button className={twMerge("w-full mb-2 bg-transparent border border-lightGreen text-lightGreen text-xl font-medium", review.status !== 'complete' && "hidden")}>
                    Startseite
                </Button>
            </Link>

            {/* Button to send the review */}
            <SendReviewButton/>
        </div>
    );
};

export default ReviewComponent;
