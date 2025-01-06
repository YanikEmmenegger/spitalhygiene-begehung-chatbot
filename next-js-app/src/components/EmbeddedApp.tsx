'use client'
import {useEffect, useState} from 'react';
import {FaSpinner} from 'react-icons/fa'; // Spinner icon for loading state
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import {motion} from 'framer-motion'; // Import motion for animations

const EmbeddedApp = () => {
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const [isIframeLoaded, setIsIframeLoaded] = useState(false); // State to track iframe loading status

    useEffect(() => {
        console.log("trying to load iframe with url: ", process.env.NEXT_PUBLIC_EMBEDDED_APP); // Log the iframe URL
        const checkCookie = () => {
            const cookieValue = Cookies.get('disclaimerAccepted'); // Check for the cookie
            if (cookieValue === 'true') {
                setIsLoading(false); // Stop showing loading spinner if cookie exists
            } else {
                setTimeout(checkCookie, 1000); // Retry checking cookie every second
            }
        };

        checkCookie(); // Start initial cookie check
    }, []);

    const handleIframeLoad = () => {
        setTimeout(() => {
            setIsIframeLoaded(true); // Mark iframe as fully loaded
        }, 1000); // Add a delay to ensure iframe rendering is complete
    };

    return (
        <div className="relative flex flex-col text-center h-full mx-auto">
            {/* Overlay with loading spinner */}
            {(isLoading || !isIframeLoaded) && (
                <div className="absolute inset-0 flex flex-col gap-2 justify-center items-center bg-transparent">
                    <p>
                        laden... {/* Loading message */}
                    </p>
                    <FaSpinner className="animate-spin text-darkGray h-12 w-12"/> {/* Spinner icon */}
                </div>
            )}

            {/* Render iframe only if cookie exists */}
            {!isLoading && (
                <motion.div
                    initial={{opacity: 0}} // Fade-in animation starts at 0 opacity
                    animate={{opacity: isIframeLoaded ? 1 : 0}} // Fade to full opacity when iframe is loaded
                    transition={{duration: 1}} // Animation duration for smooth effect
                    className="w-full flex-1 overflow-auto"
                >
                    <iframe
                        title="Embedded Application"
                        className="w-full h-full" // Full width and height for iframe
                        allowFullScreen={true} // Enable fullscreen mode
                        onLoad={handleIframeLoad} // Update state when iframe is loaded
                        src={process.env.NEXT_PUBLIC_EMBEDDED_APP} // Source URL for iframe
                    ></iframe>
                </motion.div>
            )}
        </div>
    );
};

export default EmbeddedApp;
