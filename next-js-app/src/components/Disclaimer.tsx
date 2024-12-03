'use client'
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import {motion} from 'framer-motion';
import Button from "@/components/Button"; // Import framer-motion

const Disclaimer: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Check if disclaimer cookie exists and hide disclaimer if it does
    useEffect(() => {
        const cookieExists = Cookies.get('disclaimerAccepted');
        setIsVisible(!cookieExists); // Show disclaimer if no cookie is found
    }, []);

    // Handle the acceptance of the disclaimer and set a 30-day cookie
    const handleAccept = () => {
        Cookies.set('disclaimerAccepted', 'true', {expires: 30, path: '/'});
        setIsFadingOut(true); // Trigger fade-out animation

        // Hide disclaimer after animation
        setTimeout(() => {
            setIsVisible(false);
        }, 500);
    };

    if (!isVisible) return null; // Don't render the disclaimer if cookie exists

    return (
        <motion.div
            initial={{opacity: 1}}
            animate={{opacity: isFadingOut ? 0 : 1}}
            transition={{duration: 0.3}}
            className="fixed w-screen h-screen flex items-center justify-center bg-gray-100 backdrop-blur-lg z-50"
        >
            {/* Main Disclaimer Box */}
            <div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl md:max-h-[80vh] md:h-auto h-screen overflow-auto md:w-11/12 lg:w-9/12 xl:w-3/4 relative">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-5">
                    Disclaimer Titel
                </h1>
                <p className="text-sm text-gray-600 mb-6">
                    disclaimer text - hier kommt der disclaimer text hin, der angezeigt werden soll um zu akzeptieren, dass bla bla blalb alblalblalbalblal
                </p>

                {/* Accept Button */}
                <div className="flex justify-center">
                    <Button  onClick={handleAccept} className="w-full">
                        Akzeptieren
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default Disclaimer;
