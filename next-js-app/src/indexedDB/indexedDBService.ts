// Importing Dexie, a wrapper library for IndexedDB, to handle database operations
import Dexie from 'dexie';
import {Review} from "@/types"; // Importing the `Review` type for type safety

// Initializing the IndexedDB database with Dexie
const db = new Dexie('LocalReviewDB');

// Defining a schema for the 'reviews' table
db.version(1).stores({
    reviews: '_id, department, date, reviewer, location, result, resultPercentage, status',
    // Fields used for querying and storage. `_id` is the primary key.
});

// Function to add a new review to the database
export const addReview = async (review: Review) => {
    try {
        await db.table('reviews').add(review); // Adding the review
        return true; // Return true if successful
    } catch (e) {
        console.error(e); // Log errors
        return false; // Return false if there was an error
    }
};

// Function to update an existing review in the database
export const updateReview = async (review: Review) => {
    try {
        await db.table('reviews').update(review._id, review); // Updating the review by its `_id`
        return true; // Return true if successful
    } catch (e) {
        console.error(e); // Log errors
        return false; // Return false if there was an error
    }
};

// Function to fetch a specific review by its `_id`
export const getReviewById = async (_id: string) => {
    try {
        return db.table('reviews').get(_id); // Return the review if found
    } catch (e) {
        console.error(e); // Log errors
        return null; // Return null if there was an error or no review found
    }
};

// Function to fetch all reviews from the database
export const getAllReviews = async () => {
    return db.table('reviews').toArray(); // Return all reviews as an array
}

// Function to delete a specific review by its `_id`
export const deleteReview = async (id: string) => {
    try {
        await db.table('reviews').delete(id); // Delete the review
        return true; // Return true if successful
    } catch (e) {
        console.error(e); // Log errors
        return false; // Return false if there was an error
    }
}

// Function to delete all reviews from the database
export const deleteAllReviews = async () => {
    try {
        await db.table('reviews').clear(); // Clear all reviews
        return true; // Return true if successful
    } catch (e) {
        console.error(e); // Log errors
        return false; // Return false if there was an error
    }
}

// Exporting the database instance for reuse in other parts of the application
export default db;
