import {FC, useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {twMerge} from "tailwind-merge";
import {X} from "lucide-react";

interface ModalProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void; // Callback for closing the modal
}

const Modal: FC<ModalProps> = ({children, isOpen, onClose}) => {
    // Create a modal root element if it doesn't exist
    useEffect(() => {
        const modalRoot = document.getElementById("modal-root");
        if (!modalRoot) {
            const div = document.createElement("div");
            div.setAttribute("id", "modal-root");
            document.body.appendChild(div);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Add scroll lock
            document.body.style.overflow = "hidden";
        } else {
            // Remove scroll lock
            document.body.style.overflow = "";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Framer Motion animation variants
    const backdropVariants = {
        hidden: {opacity: 0},
        visible: {opacity: 1},
    };

    const modalVariants = {
        hidden: {opacity: 0, y: 50},
        visible: {opacity: 1, y: 0},
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdropVariants}
                    onClick={onClose} // Close modal when clicking on backdrop
                >
                    <motion.div
                        className={twMerge(
                            "max-w-lg w-full bg-white p-8 shadow-lg relative",
                            "h-full max-h-screen md:max-h-[95vh] md:h-auto overflow-y-auto"
                        )}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={modalVariants}
                        transition={{duration: 0.3}}
                    >
                        <div className={"mt-10"}>
                            {children}

                        </div>
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={onClose}
                        >
                            <X size={38}/>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>)
};

export default Modal;
