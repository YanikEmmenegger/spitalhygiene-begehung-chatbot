import React, { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { twMerge } from "tailwind-merge";

/**
 * CollapsibleSectionProps
 *
 * - `title`: The title displayed on the collapsible header (required).
 * - `children`: The content displayed when the section is expanded.
 * - `_isOpen`: Initial open/closed state (optional, default is `false`).
 * - `ButtonPadding`: Additional padding classes for the button (optional).
 * - `border`: Whether to show a border below the header (optional).
 */
interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    _isOpen?: boolean;
    ButtonPadding?: string;
    border?: boolean;
}

/**
 * CollapsibleSection Component
 *
 * - A reusable, animated collapsible component for toggling visibility of content.
 * - Uses Framer Motion for smooth expand/collapse animations.
 */
const CollapsibleSection: FC<CollapsibleSectionProps> = ({
                                                             title,
                                                             children,
                                                             _isOpen = false,
                                                             ButtonPadding,
                                                             border,
                                                         }) => {
    const [isOpen, setIsOpen] = useState(_isOpen);

    return (
        <div className="py-3 my-2 w-full">
            {/* Header Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge(
                    "w-full flex items-center justify-between focus:outline-none",
                    ButtonPadding,
                    border ? "border-b border-b-black" : ""
                )}
            >
                <h3 className="text-lg font-semibold">{title}</h3>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Animated Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollapsibleSection;
