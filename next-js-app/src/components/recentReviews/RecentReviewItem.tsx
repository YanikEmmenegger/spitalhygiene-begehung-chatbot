import {FC} from "react";
import {Review} from "@/types";
import Link from "next/link";
import {getDisplayNameofDate} from "@/utils/dateFormat";

interface RecentReviewItemProps {
    review: Review;
    onDelete: () => void;
}

const RecentReviewItem: FC<RecentReviewItemProps> = ({review, onDelete}) => {


    return (
            <div
                className="w-full p-2 rounded-lg bg-w hite shadow-md flex justify-between items-center border border-gray-200">
                <Link className={"flex-1"} href={"/begehung/review/" + review._id}>

                <div className="flex flex-col text-left">
                <span className="text-gray-700 font-medium">
                    {review.department}
                </span>
                    <span className="text-gray-500 text-sm">{review.location}</span>
                </div>
                </Link>
                <div className={"flex  flex-col items-end justify-end"}>
                    <div className={"flex justify-center gap-2 items-center"}>
                        <div className="text-gray-600">
                            <span className="text-sm font-medium">{getDisplayNameofDate(review.date)}</span>
                        </div>
                        {review.status !== "complete" &&
                            <div className="text-amber-500">
                                <span className="text-sm font-medium">In bearb.</span>
                            </div>
                        }
                    </div>
                    <div className="text-lightRed cursor-pointer">
                        <span onClick={onDelete} className="text-sm font-medium">löschen</span>
                    </div>
                </div>
            </div>
    );
};

export default RecentReviewItem;
