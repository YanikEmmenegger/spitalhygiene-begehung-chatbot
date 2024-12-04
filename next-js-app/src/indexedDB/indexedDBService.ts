import Dexie from 'dexie';
import {Review} from "@/types";


const db = new Dexie('LocalReviewDB');

db.version(1).stores({
    // Including all top-level fields in the schema for storage.
    reviews: '_id, department, date, reviewer, location, result, resultPercentage, status',
});

// Define the Review type in Dexie
export const addReview = async (review: Review) => {
    try {
        await db.table('reviews').add(review);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const updateReview = async (review: Review) => {
    try {
        await db.table('reviews').update(review._id, review);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export const getReviewById = async (_id: string) => {
    try {
        return db.table('reviews').get(_id);
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getAllReviews = async () => {
    return db.table('reviews').toArray();
}

export const deleteReview = async (id: string) => {
    try {
        await db.table('reviews').delete(id);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}
export const deleteAllReviews = async () => {
    try {
        await db.table('reviews').clear();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default db;
