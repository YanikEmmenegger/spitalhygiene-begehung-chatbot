'use client'
import EmbeddedApp from "@/components/EmbeddedApp";
import Navigation from "@/components/Navigation";
import {useEffect, useState} from "react";
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
                setIsSmallScreen(true); // Set small screen state
            } else {
                setNavVisible(true); // Show navigation on larger screens
                setIsSmallScreen(false); // Reset small screen state
            }
        };

        // Initial check on component mount
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup resize listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (

        <div className="flex flex-1 w-full overflow-hidden relative">
            {/* Main Content: Adjusts width based on navigation visibility */}
            <div
                className={`transition-all duration-300 ease-in-out ${isNavVisible ? 'w-full lg:w-3/4' : 'w-full'} flex-1`}
            >
                <EmbeddedApp/>
            </div>

            {/* Navigation Component */}
            <NavigationButton isNavVisible={isNavVisible} toggleNav={() => setNavVisible(!isNavVisible)}
                              isSmallScreen={isSmallScreen}/>
            <Navigation
                toggleNav={() => setNavVisible(!isNavVisible)}
                isSmallScreen={isSmallScreen}
                isNavVisible={isNavVisible}
            />
        </div>
    );
}
