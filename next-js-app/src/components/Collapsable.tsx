import React, {FC, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown, ChevronUp} from "lucide-react";
import {twMerge} from "tailwind-merge";

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    _isOpen?: boolean;
    ButtonPadding?: string;
    border?: boolean;
}

const CollapsibleSection: FC<CollapsibleSectionProps> = ({title, children, _isOpen, ButtonPadding, border}) => {
    const [isOpen, setIsOpen] = useState(_isOpen || false);

    return (
        <div className="py-3 my-2 w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={twMerge("w-full flex items-center justify-between focus:outline-none", ButtonPadding, border ? "border-b border-b-black" : "")}
            >
                <h3 className="text-lg font-semibold">{title}</h3>
                {!isOpen ? <ChevronDown/> : <ChevronUp/>}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
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
