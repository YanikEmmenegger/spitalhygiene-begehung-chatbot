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
    reviewID: string;
}

const ReviewComponent: FC<ReviewComponentProps> = ({reviewID}) => {
    return (
        <ReviewProvider reviewID={reviewID}>
            <div className="flex justify-center w-full">
                <InnerReviewComponent/>
            </div>
        </ReviewProvider>
    );
};


const InnerReviewComponent: FC = () => {
    const {review, sortedCategories, toggleModal, setReviewToComplete} = useReview();
    if (!review) {
        return <p className="text-center text-gray-500">Lade...</p>;
    }
    const handleSubmit = () => {
        //check if all questions are answered reiview.reviewItems.status === 'not reviewed'
        const notReviewed = review.reviewItems.filter((item) => item.status === 'not reviewed').length;
        if (notReviewed > 0) {
            alert("Bitte alle Fragen beantworten");
            return;
        } else {
            setReviewToComplete();
        }
    }

    return (
        <div
            className={twMerge("w-full mb-20 mt-5 max-w-2xl bg-white")}>
            <div className={twMerge("flex flex-col gap-2", review.status === 'complete' ? "opacity-80" : "opacity-100")}>
                <div className="flex border-b-2 mx-2 pb-5 border-neutral-300 justify-between">
                    <div>
                        <p className="text-gray-600 font-semibold">
                            Begehung vom: <span className="text-gray-800">{getDisplayNameofDate(review.date)}</span>
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Abteilung:</span> {review.department.name}
                        </p>
                        <p className="text-gray-600">
                            <span
                                className="font-semibold">Geprüft von: </span>{review.reviewer.split("@")[0].split(".").join(" ")}
                        </p>

                            <p className="text-gray-600">
                                <span className="font-semibold">Prozent: </span>{review.resultPercentage}%
                            </p>

                        {review.result &&
                            <p className="text-gray-600">
                            <span
                                className="font-semibold">Ampel: </span>
                                {review.result === "green" ? "🟢" : review.result === "yellow" ? "🟡" : "🔴"}
                            </p>
                        }
                        {
                            review.resultDescription &&
                            <p className="text-gray-600">
                                <span className="font-semibold">Hauptabweichungen: </span>{review.resultDescription}
                            </p>
                        }
                    </div>
                    <div className="flex items-end">
                        <span>
                            {review.status === "complete" ? (
                                <p className="text-lightGreen">Abgeschlossen</p>
                            ) : (
                                <p className="text-amber-500">In Bearbeitung</p>
                            )}
                        </span>
                    </div>
                </div>
                <div>
                    {Object.entries(sortedCategories).map(([categoryName]) => (
                        <CategoryComponent key={categoryName} categoryName={categoryName}/>
                    ))}
                </div>
                <Button onClick={toggleModal}
                        className={twMerge("w-full bg-transparent border border-lightGreen text-lightGreen text-xl font-medium", review.status === 'complete' && "hidden")}>
                    Zusätzliche Fragen
                </Button>
                <CompleteButton disabled={review.status === 'complete'} onClick={handleSubmit}/>
            </div>
            <Link href={"/begehung"}>
                <Button
                        className={twMerge("w-full mb-2 bg-transparent border border-lightGreen text-lightGreen text-xl font-medium", review.status !== 'complete' && "hidden")}>
                    Startseite
                </Button>
            </Link>
            <SendReviewButton/>

        </div>
    );
};

export default ReviewComponent;
