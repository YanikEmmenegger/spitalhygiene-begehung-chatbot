'use client';
import {useEffect, useState} from "react";
import {Review} from "@/types";
import {deleteAllReviews, deleteReview, getAllReviews} from "@/indexedDB/indexedDBService";
import RecentReviewItem from "@/components/recentReviews/RecentReviewItem";
import DeleteAll from "@/components/recentReviews/DeleteAll";

const RecentReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]); // Stores the list of reviews
    const [loading, setLoading] = useState(true); // Indicates whether data is being fetched

    // Fetch all reviews from IndexedDB
    const fetchReviews = async () => {
        const data = await getAllReviews();
        setReviews(data);
        setLoading(false); // Set loading to false after data is fetched
    };

    useEffect(() => {
        fetchReviews(); // Fetch reviews when the component mounts
    }, []);

    // Handle deletion of all reviews
    const handleDeleteAll = async () => {
        try {
            if (await deleteAllReviews()) {
                setReviews([]); // Clear the reviews from the state
            }
        } catch (e) {
            console.log("Fehler beim Löschen der Begehungen", e); // Log any errors
        }
    };

    // Handle deletion of a single review
    const handleDelete = async (id: string) => {
        try {
            if (await deleteReview(id)) {
                fetchReviews(); // Refresh the reviews list after deletion
            }
        } catch (e) {
            console.log("Fehler beim Löschen der Begehung", e); // Log any errors
        }
    };

    return (
        <div className="w-full px-4 sm:w-[90%] pb-10 lg:w-[70%] mx-auto">
            {/* Header */}
            <h1 className="text-left text-xl font-semibold my-5 text-gray-800">
                Kürzliche Begehungen
            </h1>
            {loading ? (
                // Loading state
                <p className="text-center text-gray-500">Lade...</p>
            ) : (
                <>
                    <div className="flex flex-col gap-4 items-center justify-center">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <RecentReviewItem
                                    onDelete={() => handleDelete(review._id)} // Pass delete handler
                                    review={review}
                                    key={`Review-${index}`} // Use index for unique key
                                />
                            ))
                        ) : (
                            ""
                        )}
                    </div>
                    {reviews.length === 0 && (
                        <p className="text-left text-gray-500">Keine Begehungen vorhanden</p>
                    )}
                </>
            )}

            {/* Delete All button, shown only if reviews exist */}
            {reviews.length !== 0 && <DeleteAll onDelete={handleDeleteAll} />}
        </div>
    );
};

export default RecentReviews;
