import { motion } from 'framer-motion'; // For animations
import { twMerge } from 'tailwind-merge'; // Utility for merging Tailwind classes
import Button from "@/components/Button"; // Reusable Button component
import MenuButtons from "@/components/MenuButtons"; // Component for menu buttons

// Props for the Navigation component
interface NavigationProps {
    isNavVisible: boolean; // Whether the navigation is visible
    isSmallScreen: boolean; // Whether it's a small screen
    toggleNav: () => void; // Function to toggle navigation visibility
}

// Navigation component definition
const Navigation: React.FC<NavigationProps> = ({ isNavVisible, isSmallScreen, toggleNav }) => {
    return (
        <motion.div
            initial={false} // Skip animation on initial render
            animate={{
                width: isNavVisible
                    ? isSmallScreen
                        ? '100%' // Full width on small screens
                        : '35%'  // Partial width on larger screens
                    : '0%',      // Hidden state
            }}
            transition={{ duration: 0.3 }} // Smooth transition
            className={twMerge(
                "h-full absolute bg-white lg:bg-transparent lg:relative right-0 top-0 flex flex-col overflow-hidden",
                isNavVisible ? 'block border-l-[1px]' : 'hidden lg:block' // Visibility handling
            )}
        >
            <motion.div
                className="p-4 flex flex-col overflow-scroll justify-between h-full"
                animate={{ opacity: isNavVisible ? 1 : 0 }} // Fade in/out
                transition={{ delay: 0.2 }}
            >
                {/* Menu Content */}
                <div className={twMerge("mx-5 mt-20 lg:text-left", isNavVisible ? "opacity-100" : "opacity-0")}>
                    <h2 className="text-3xl mb-5 text-lightGray font-bold">Menu</h2>

                    {/* Placeholder for navigation links */}
                    <div className="flex flex-col items-start gap-1">
                        {/* Example text */}
                        <div className={"text-lightGray border-t-[1px] pt-5"}>
                            Hier könnte noch ein weiterer Text stehen, was hier stehen soll, kann noch angepasst oder gelöscht werden...
                        </div>
                    </div>

                    {/* Toggle button for small screens */}
                    {isSmallScreen && (
                        <div className="mt-10 pb-5">
                            <Button onClick={toggleNav}>
                                →
                            </Button>
                        </div>
                    )}

                    {/* Footer section for menu buttons */}
                    <div className="py-5 mb-16 flex items-center justify-between">
                        <MenuButtons />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Navigation; // Export the Navigation component
