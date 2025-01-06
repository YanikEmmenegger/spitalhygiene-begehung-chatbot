'use client';

import {twMerge} from "tailwind-merge";
import {useState} from "react";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion";
import {useReview} from "@/context/ReviewContext";
import {VscLoading} from "react-icons/vsc";
import Button from "@/components/Button";

/**
 * SendReviewButton Component
 *
 * This component handles sending the review data to the server and provides feedback to the user
 * about the success or failure of the operation. It is designed to be used in the context of
 * a completed review process.
 */
const SendReviewButton = () => {
    const {review} = useReview(); // Access the review from the context

    const [status, setStatus] = useState<{ sent: boolean; error: string | null }>({
        sent: false, // Indicates if the review has been successfully sent
        error: null, // Stores error messages if sending fails
    });
    const [loading, setLoading] = useState<boolean>(false); // Indicates if the sending process is ongoing

    /**
     * Handles sending the review via an API call.
     * Updates the state to reflect success or failure.
     */
    const handleSendReview = async () => {
        setLoading(true); // Set loading to true while processing
        if (review) {
            try {
                const response = await axios.post(`/api/review/send`, {review});
                if (response.status === 200) {
                    setStatus({sent: true, error: null}); // Successfully sent
                } else {
                    setStatus({
                        sent: false,
                        error: "Beim Versenden des Berichts ist ein Fehler aufgetreten, bitte versuchen Sie es erneut.",
                    });
                }
            } catch (e) {
                setStatus({
                    sent: false,
                    error: "Beim Versenden des Berichts ist ein Fehler aufgetreten, bitte versuchen Sie es erneut.",
                });
                console.error(e);
            } finally {
                setLoading(false); // Reset loading state
                // Automatically hide the message after 5 seconds
                setTimeout(() => {
                    setStatus({sent: false, error: null});
                }, 5000);
            }
        }
    };

    return (
        <div className="flex justify-center flex-col items-center relative">
            {/* Button for sending the review */}
            <Button
                disabled={status.sent} // Disable button if review has been sent
                onClick={handleSendReview}
                className={twMerge(
                    "w-full mb-20 border border-lightGreen text-xl font-medium",
                    review!.status !== "complete" && "hidden" // Hide button if review is incomplete
                )}
            >
                {loading ? (
                    <p className="flex justify-center items-center">
                        <VscLoading size="26" className="animate-spin"/> {/* Loading spinner */}
                    </p>
                ) : status.sent ? (
                    "Gesendet" // Success state text
                ) : (
                    "Bericht erstellen und senden" // Default button text
                )}
            </Button>

            {/* Animated feedback message */}
            <AnimatePresence>
                {status.error && (
                    <motion.p
                        className="text-white w-full absolute bottom-5 max-w-2xl border border-lightRed p-3 bg-lightRed rounded-lg"
                        initial={{y: 50, opacity: 0}} // Animation starting state
                        animate={{y: 25, opacity: 1}} // Animation visible state
                        exit={{y: 50, opacity: 0}} // Animation exit state
                        transition={{duration: 0.5}} // Animation timing
                    >
                        {status.error}
                    </motion.p>
                )}
                {status.sent && !status.error && (
                    <motion.p
                        className="text-white w-full absolute bottom-5 max-w-2xl border border-lightGreen p-3 bg-lightGreen rounded-lg"
                        initial={{y: 50, opacity: 0}}
                        animate={{y: 25, opacity: 1}}
                        exit={{y: 50, opacity: 0}}
                        transition={{duration: 0.5}}
                    >
                        Bericht wurde erfolgreich erstellt und versendet, bitte Postfach prüfen
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SendReviewButton;
