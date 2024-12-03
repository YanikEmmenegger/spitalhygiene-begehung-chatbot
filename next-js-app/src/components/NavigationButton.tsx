import {FC} from "react";
import {twMerge} from "tailwind-merge";
import {motion} from "framer-motion";

interface NavigationButtonProps {
    isNavVisible: boolean;
    toggleNav: () => void;
    isSmallScreen: boolean;
}

const NavigationButton: FC<NavigationButtonProps> = ({isNavVisible, toggleNav, isSmallScreen}) => {
    return (
        <motion.button
            onClick={toggleNav}
            initial={false} // Disables initial animation state to avoid buggy behavior
            className={twMerge(
                "absolute outline-0 top-1/2 transform -translate-y-1/2 p-2 z-20 bg-lightGreen hover:bg-DarkGreen rounded-l-lg text-white text-xl",
                isSmallScreen && isNavVisible ? "hidden" : "block" // Hide the button on small screens when the nav is visible
            )}
            animate={{
                right: isNavVisible ? '34%' : '0%', // Move button based on nav visibility
            }}
            transition={{duration: 0.3}} // Smooth transition
        >
            {/* Button label changes based on nav visibility and screen size */}
            {isSmallScreen ? (!isNavVisible ? '←' : 'X') : (!isNavVisible ? '←' : '→')}
        </motion.button>
    );
}

export default NavigationButton;
