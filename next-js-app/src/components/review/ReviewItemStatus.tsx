'use client'

import {FC} from "react";
import {twMerge} from "tailwind-merge";
import Button from "@/components/Button";

interface ReviewItemStatusProps {
    option?: string; // The label for the button, e.g., "Erfüllt"
    onclick?: () => void; // Callback function when the button is clicked
    selected?: boolean; // Indicates if the button is currently selected
    disabled?: boolean; // Determines if the button is disabled
}

// A functional component to render a status button for review items
const ReviewItemStatus: FC<ReviewItemStatusProps> = ({option, onclick, selected, disabled}) => {
    return (
        <Button
            disabled={disabled} // Disable the button if `disabled` is true
            className={twMerge(
                selected ? "bg-lightGreen" : "bg-transparent text-lightGreen", // Apply styles based on the `selected` state
                "border-lightGreen border text-sm" // Shared button styles
            )}
            onClick={onclick} // Trigger the provided callback on click
        >
            {option} {/* Display the option label */}
        </Button>
    );
}

export default ReviewItemStatus;
