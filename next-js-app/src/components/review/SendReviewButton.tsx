'use client';

import {twMerge} from "tailwind-merge";
import {useState} from "react";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion";
import {useReview} from "@/context/ReviewContext";
import {VscLoading} from "react-icons/vsc";
import Button from "@/components/Button";

const SendReviewButton = () => {
    const {review} = useReview();

    const [status, setStatus] = useState<{ sent: boolean; error: string | null }>({
        sent: false,
        error: null,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleSendReview = async () => {
        setLoading(true);
        if (review) {
            try {
                const response = await axios.post(`/api/review/send`, {review});
                if (response.status === 200) {
                    setStatus({sent: true, error: null});
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
                console.log(e);
            } finally {
                setLoading(false);
                // Hide the message after 5 seconds
                setTimeout(() => {
                    setStatus({sent: false, error: null})

                }, 5000);
            }
        }
    };

    return (
        <div className="flex justify-center flex-col items-center relative">
            <Button
                disabled={status.sent}
                onClick={handleSendReview}
                className={twMerge(
                    "w-full mb-20 border border-lightGreen text-xl font-medium",
                    review!.status !== "complete" && "hidden"
                )}
            >
                {loading ? (
                    <p className="flex justify-center items-center">
                        <VscLoading size="26" className="animate-spin"/>
                    </p>
                ) : status.sent ? (
                    "Gesendet"
                ) : (
                    "Bericht erstellen und senden"
                )}
            </Button>

            {/* Animated success or error message */}
            <AnimatePresence>
                {status.error && (
                    <motion.p
                        className="text-white w-full absolute bottom-5 max-w-2xl border border-lightRed p-3 bg-lightRed rounded-lg"
                        initial={{y: 50, opacity: 0}}
                        animate={{y: 25, opacity: 1}}
                        exit={{y: 50, opacity: 0}}
                        transition={{duration: 0.5}}
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
