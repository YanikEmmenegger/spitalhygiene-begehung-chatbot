import { FC } from "react";
import ReviewItemStatus from "@/components/review/ReviewItemStatus";
import { ReviewItemStatusOptions } from "@/types";

interface PersonStatusSelectorProps {
    value: ReviewItemStatusOptions; // Current selected status
    onChange: (status: ReviewItemStatusOptions) => void; // Callback to handle status change
}

const PersonStatusSelector: FC<PersonStatusSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex gap-2 mt-2">
            {/* Approved status */}
            <ReviewItemStatus
                selected={value === "approved"}
                onclick={() => onChange("approved")}
                option="Erfüllt"
            />
            {/* Failed status */}
            <ReviewItemStatus
                selected={value === "failed"}
                onclick={() => onChange("failed")}
                option="Nicht erfüllt"
            />
            {/* Partially approved status */}
            <ReviewItemStatus
                selected={value === "partially approved"}
                onclick={() => onChange("partially approved")}
                option="Nicht Anwendbar"
            />
        </div>
    );
};

export default PersonStatusSelector;
