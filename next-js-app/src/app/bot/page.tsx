'use client';

import EmbeddedApp from "@/components/EmbeddedApp";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import NavigationButton from "@/components/NavigationButton";

export default function Home() {
    // State for toggling navigation visibility
    const [isNavVisible, setNavVisible] = useState(true);

    // State for detecting small screen sizes
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Effect to detect screen size and adjust navigation visibility
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1028) {
                setNavVisible(false); // Automatically hide navigation on small screens
                setIsSmallScreen(true); // Mark as a small screen
            } else {
                setNavVisible(true); // Show navigation on larger screens
                setIsSmallScreen(false); // Reset small screen state
            }
        };

        // Initial check when component mounts
        handleResize();

        // Add an event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-1 w-full overflow-hidden relative">
            {/* Main Content Section */}
            <div
                className={`transition-all duration-300 ease-in-out ${
                    isNavVisible ? 'w-full lg:w-3/4' : 'w-full'
                } flex-1`}
            >
                <EmbeddedApp /> {/* The primary application content */}
            </div>

            {/* Navigation Toggle Button */}
            <NavigationButton
                isNavVisible={isNavVisible}
                toggleNav={() => setNavVisible(!isNavVisible)} // Toggle navigation visibility
                isSmallScreen={isSmallScreen}
            />

            {/* Navigation Sidebar */}
            <Navigation
                toggleNav={() => setNavVisible(!isNavVisible)} // Toggle visibility from within Navigation
                isSmallScreen={isSmallScreen}
                isNavVisible={isNavVisible}
            />
        </div>
    );
}
