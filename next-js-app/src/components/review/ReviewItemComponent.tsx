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
    reviewItem: ReviewItem;
}

const ReviewItemComponent: FC<ReviewItemComponentProps> = ({reviewItem}) => {
    const [comment, setComment] = useState<string>(reviewItem.comment || "");
    const [saveButtonText, setSaveButtonText] = useState<string | React.ReactNode>("Speichern");

    const {updateReviewItemStatus, updateComment, review} = useReview();

    const handleStatusChange = (status: ReviewItemStatusOptions) => {
        updateReviewItemStatus(reviewItem.question.id, status);
    };

    const handleSave = async () => {
        setSaveButtonText("Speichere....");

        try {

            updateComment(reviewItem.question.id, comment);
            setSaveButtonText("Gespeichert");
            setTimeout(() => setSaveButtonText("Speichern"), 1000);

        } catch (e) {
            console.error("Fehler beim Speichern des Kommentars", e);
        }
    }
    return (
        <li className={twMerge("py-4 my-5 p-2", reviewItem.question.critical ? "bg-amber-100" : "bg-neutral-50")}>
            <p className="text-sm text-gray-500">{reviewItem.question.subcategory.name} {reviewItem.question.critical && "(Hauptkriterium)"} | {reviewItem.question.type}</p>
            <p className="text-gray-700">{reviewItem.question.question}</p>
            <div className="flex gap-2 my-4">
                <ReviewItemStatus
                    disabled={review?.status === "complete"}
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
            <div>
                <Collapsable border={false} _isOpen={false} title={"Kommentar"}>
                    <textarea
                        disabled={review?.status === "complete"}
                        className="w-full mt-5 p-2 min-h-36 border border-gray-300"
                        placeholder="Verfassen Sie einen kommentar..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                    <Button onClick={handleSave}
                            className={twMerge("w-full ", review?.status === "complete" && "hidden")}>
                        {saveButtonText}
                    </Button>
                </Collapsable>
               <PersonList  reviewItemID={reviewItem._id} initialPersons={reviewItem.persons}/>
            </div>
        </li>
    );
};

export default ReviewItemComponent;
