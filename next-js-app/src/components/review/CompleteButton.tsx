'use client'
import {FC, useState} from "react"; // Importing Function Component type and useState hook from React
import Button from "@/components/Button"; // Button component for user interactions
import {twMerge} from "tailwind-merge"; // Utility for merging Tailwind CSS classes

// Props type definition for CompleteButton
interface CompleteButtonProps {
    onClick: () => void; // Function to execute when the button is confirmed
    disabled: boolean; // Determines if the button is disabled
}

// Functional component for a confirmation button to mark a process as complete
const CompleteButton: FC<CompleteButtonProps> = ({onClick, disabled}) => {
    // State to track if the confirmation prompt is expanded
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className={twMerge("my-5", disabled && "hidden")}>
            {/* Conditional rendering based on expanded state */}
            {expanded ? (
                <div className={"flex items-center justify-center gap-3 w-full"}>
                    {/* Confirmation button */}
                    <Button className={"w-full text-xl font-medium bg-lightRed"} onClick={onClick}>
                        Ja
                    </Button>
                    {/* Cancel button */}
                    <Button
                        className={"w-full text-xl font-medium bg-neutral-400"}
                        onClick={() => setExpanded(false)} // Collapse confirmation prompt
                    >
                        Abbrechen
                    </Button>
                </div>
            ) : (
                /* Primary button to expand the confirmation prompt */
                <Button
                    onClick={() => setExpanded(true)} // Expand confirmation prompt
                    disabled={disabled} // Disable the button if necessary
                    className={twMerge("w-full text-xl font-medium", disabled && "hidden")} // Merge Tailwind classes
                >
                    Abschliessen
                </Button>
            )}
        </div>
    );
};

export default CompleteButton; // Exporting the component for use in other parts of the application
