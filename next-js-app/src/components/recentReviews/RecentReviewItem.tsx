import {FC} from "react";
import {Review} from "@/types";
import Link from "next/link";
import {getDisplayNameofDate} from "@/utils/dateFormat";

interface RecentReviewItemProps {
    review: Review; // The review item to display
    onDelete: () => void; // Callback triggered when the delete action is initiated
}

const RecentReviewItem: FC<RecentReviewItemProps> = ({review, onDelete}) => {
    return (
        <div
            className="w-full p-2 rounded-lg bg-white shadow-md flex justify-between items-center border border-gray-200"
        >
            {/* Link to the review's detail page */}
            <Link className="flex-1" href={"/begehung/review/" + review._id}>
                <div className="flex flex-col text-left">
                    {/* Display the department name */}
                    <span className="text-gray-700 font-medium">
                        {review.department.name}
                    </span>
                    {/* Display the review date */}
                    <span className="text-xs font-light">
                        {getDisplayNameofDate(review.date)}
                    </span>
                </div>
            </Link>

            {/* Status and delete controls */}
            <div className="flex flex-col items-end justify-end">
                {/* Status Indicator */}
                <div className="flex justify-center gap-2 items-center">
                    {review.status !== "complete" && (
                        <div className="text-amber-500">
                            <span className="text-sm font-medium">In bearb.</span>
                        </div>
                    )}
                </div>

                {/* Delete Action */}
                <div className="text-lightRed cursor-pointer">
                    <span onClick={onDelete} className="text-sm font-medium">
                        löschen
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecentReviewItem;
