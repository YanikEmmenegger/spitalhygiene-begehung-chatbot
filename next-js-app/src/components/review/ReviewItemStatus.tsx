'use client'
import {FC} from "react";
import {twMerge} from "tailwind-merge";
import Button from "@/components/Button";

interface ReviewItemStatusProps {
    option?: string;
    onclick?: () => void;
    selected?: boolean;
    disabled?: boolean;
}

const ReviewItemStatus: FC<ReviewItemStatusProps> = ({option, onclick, selected, disabled}) => {


    return (
        <Button
            disabled={disabled}
            className={twMerge(selected ? "bg-lightGreen" : "bg-transparent  text-lightGreen", "border-lightGreen border text-sm")}
                onClick={onclick}>
            {option}
        </Button>
    );
}

export default ReviewItemStatus;
