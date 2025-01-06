'use client';

// Import necessary modules and hooks
import {FC, useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion"; // For animations
import {twMerge} from "tailwind-merge"; // For merging Tailwind classes
import {X} from "lucide-react"; // For close icon

interface ModalProps {
    children: React.ReactNode; // Content of the modal
    isOpen: boolean; // Whether the modal is open
    onClose: () => void; // Callback for closing the modal
    size?: 'default' | 'large'; // Size of the modal, 'default' or 'large'
}

const Modal: FC<ModalProps> = ({children, isOpen, onClose, size = 'default'}) => {
    // Ensure a modal root element exists in the DOM
    useEffect(() => {
        const modalRoot = document.getElementById("modal-root");
        if (!modalRoot) {
            const div = document.createElement("div");
            div.setAttribute("id", "modal-root");
            document.body.appendChild(div);
        }
    }, []);

    // Add or remove scroll lock based on modal state
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Lock scrolling
        } else {
            document.body.style.overflow = ""; // Unlock scrolling
        }

        // Cleanup on component unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Framer Motion animation variants for backdrop and modal
    const backdropVariants = {
        hidden: {opacity: 0},
        visible: {opacity: 1},
    };

    const modalVariants = {
        hidden: {opacity: 0, y: 50}, // Modal slides in from below
        visible: {opacity: 1, y: 0}, // Modal is fully visible
    };

    // Determine the width of the modal based on the `size` prop
    const widthClasses = size === 'large' ? 'max-w-4xl' : 'max-w-lg';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30" // Backdrop styling
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    onClick={onClose} // Close modal when clicking on backdrop
                >
                    <motion.div
                        className={twMerge(
                            `${widthClasses} w-full bg-white p-8 shadow-lg relative`,
                            "h-full max-h-screen md:max-h-[95vh] md:h-auto overflow-y-auto" // Responsive height and scrollable content
                        )}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        transition={{duration: 0.3}} // Smooth animation
                    >
                        <div className={"mt-10"}>{children}</div> {/* Modal content */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" // Close button styling
                            onClick={onClose} // Close modal on button click
                        >
                            <X size={38}/> {/* Close icon */}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal; // Export the Modal component
