'use client';
import {useEffect, useState} from "react";
import {Review} from "@/types";
import {deleteAllReviews, deleteReview, getAllReviews} from "@/indexedDB/indexedDBService";
import RecentReviewItem from "@/components/recentReviews/RecentReviewItem";
import DeleteAll from "@/components/recentReviews/DeleteAll";


const RecentReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        const data = await getAllReviews();
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteAll = async () => {
        try {
            if (await deleteAllReviews()) {
                setReviews([]);
            }

        } catch (e) {
            console.log("Fehler beim Löschen der Begehungen", e);
        }
    }
    const handleDelete = async (id: string) => {
        try {
            if (await deleteReview(id)) {
                fetchReviews();
            }
        } catch (e) {
            console.log("Fehler beim Löschen der Begehung", e);
        }
    }

    return (
        <div className="w-full px-4 sm:w-[90%] pb-10 lg:w-[70%] mx-auto">
            <h1 className="text-left text-xl font-semibold my-5 text-gray-800">
                Kürzliche Begehungen
            </h1>
            {loading ? (
                <p className="text-center text-gray-500">Lade...</p>
            ) : (
                <>
                <div className="flex flex-col gap-4 items-center justify-center">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            // eslint-disable-next-line react/jsx-no-undef
                            <RecentReviewItem
                                onDelete={() => handleDelete(review._id)}
                                review={review}
                                key={`Review-${index}`}
                            />
                        ))

                    ) : ""
                    }
                </div>
                    {
                        reviews.length === 0 && <p className="text-left text-gray-500">Keine Begehungen vorhanden</p>
                    }
                </>
            )}

            {reviews.length !== 0 && <DeleteAll onDelete={handleDeleteAll}/>}
        </div>
    );
};

export default RecentReviews;
