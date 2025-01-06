import { FC } from "react"; // Importing the Functional Component type from React
import { twMerge } from "tailwind-merge"; // Utility for merging Tailwind CSS classes
import { motion } from "framer-motion"; // Library for animations

// Props interface for NavigationButton
interface NavigationButtonProps {
    isNavVisible: boolean; // Indicates if the navigation is currently visible
    toggleNav: () => void; // Function to toggle the navigation visibility
    isSmallScreen: boolean; // Indicates if the device is on a small screen
}

// NavigationButton functional component
const NavigationButton: FC<NavigationButtonProps> = ({ isNavVisible, toggleNav, isSmallScreen }) => {
    return (
        <motion.button
            onClick={toggleNav} // Calls the toggleNav function when clicked
            initial={false} // Prevents an initial animation state to avoid glitches
            className={twMerge(
                "absolute outline-0 top-1/2 transform -translate-y-1/2 p-2 z-20 bg-lightGreen hover:bg-DarkGreen rounded-l-lg text-white text-xl",
                isSmallScreen && isNavVisible ? "hidden" : "block" // Hides button on small screens when the nav is visible
            )}
            animate={{
                right: isNavVisible ? '34%' : '0%', // Position the button based on nav visibility
            }}
            transition={{ duration: 0.3 }} // Smooth animation transition
        >
            {/* Render button text depending on screen size and navigation state */}
            {isSmallScreen
                ? (!isNavVisible ? '←' : 'X') // On small screens, show "←" when nav is hidden and "X" when visible
                : (!isNavVisible ? '←' : '→')}
        </motion.button>
    );
}

export default NavigationButton; // Exporting the component as default
