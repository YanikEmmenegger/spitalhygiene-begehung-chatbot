'use client';

import {FC, useState} from "react";
import {ReviewItem, ReviewItemStatusOptions} from "@/types";
import {useReview} from "@/context/ReviewContext";
import ReviewItemStatus from "@/components/review/ReviewItemStatus";
import Button from "@/components/Button";
import Collapsable from "@/components/Collapsable";
import PersonList from "@/components/review/PersonList";
import {twMerge} from "tailwind-merge";

interface ReviewItemComponentProps {
    reviewItem: ReviewItem; // Props include a single review item
}

// Component for rendering and managing a single review item
const ReviewItemComponent: FC<ReviewItemComponentProps> = ({reviewItem}) => {
    // State for managing the comment and the save button text
    const [comment, setComment] = useState<string>(reviewItem.comment || "");
    const [saveButtonText, setSaveButtonText] = useState<string | React.ReactNode>("Speichern");

    // Context hooks for updating review item data
    const {updateReviewItemStatus, updateComment, review} = useReview();

    // Handle status change of the review item
    const handleStatusChange = (status: ReviewItemStatusOptions) => {
        updateReviewItemStatus(reviewItem.question.id, status);
    };

    // Handle saving the comment for the review item
    const handleSave = async () => {
        setSaveButtonText("Speichere....");
        try {
            updateComment(reviewItem.question.id, comment); // Update comment in the context
            setSaveButtonText("Gespeichert"); // Temporarily indicate success
            setTimeout(() => setSaveButtonText("Speichern"), 1000); // Reset button text
        } catch (e) {
            console.error("Fehler beim Speichern des Kommentars", e);
        }
    };

    return (
        <li
            className={twMerge("py-4 my-5 p-2", reviewItem.question.critical ? "bg-amber-100" : "bg-neutral-50")}>
            {/* Question metadata */}
            <p className="text-sm text-gray-500">
                {reviewItem.question.subcategory.name} {reviewItem.question.critical && "(Hauptkriterium)"} | {reviewItem.question.type}
            </p>
            <p className="text-gray-700">{reviewItem.question.question}</p>

            {/* Status selection buttons */}
            <div className="flex gap-2 my-4">
                <ReviewItemStatus
                    disabled={review?.status === "complete"} // Disable if review is complete
                    selected={reviewItem.status === "approved"}
                    onclick={() => handleStatusChange("approved")}
                    option={"Erfüllt"}
                />
                <ReviewItemStatus
                    disabled={review?.status === "complete"}
                    selected={reviewItem.status === "failed"}
                    onclick={() => handleStatusChange("failed")}
                    option={"Nicht erfüllt"}
                />
                <ReviewItemStatus
                    disabled={review?.status === "complete"}
                    selected={reviewItem.status === "partially approved"}
                    onclick={() => handleStatusChange("partially approved")}
                    option={"Nicht Anwendbar"}
                />
            </div>

            {/* Comment section */}
            <div>
                <Collapsable border={false} _isOpen={false} title={"Kommentar"}>
                    <textarea
                        disabled={review?.status === "complete"} // Disable editing if review is complete
                        className="w-full mt-5 p-2 min-h-36 border border-gray-300"
                        placeholder="Verfassen Sie einen kommentar..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <Button
                        onClick={handleSave}
                        className={twMerge("w-full", review?.status === "complete" && "hidden")}>
                        {saveButtonText}
                    </Button>
                </Collapsable>

                {/* Person list for this review item */}
                <PersonList reviewItemID={reviewItem._id} initialPersons={reviewItem.persons}/>
            </div>
        </li>
    );
};

export default ReviewItemComponent;
