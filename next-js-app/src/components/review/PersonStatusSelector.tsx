import { FC } from "react";
import ReviewItemStatus from "@/components/review/ReviewItemStatus";
import { ReviewItemStatusOptions } from "@/types";

interface PersonStatusSelectorProps {
    value: ReviewItemStatusOptions;
    onChange: (status: ReviewItemStatusOptions) => void;
}

const PersonStatusSelector: FC<PersonStatusSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex gap-2 mt-2">
            <ReviewItemStatus
                selected={value === "approved"}
                onclick={() => onChange("approved")}
                option="Erfüllt"
            />
            <ReviewItemStatus
                selected={value === "failed"}
                onclick={() => onChange("failed")}
                option="Nicht erfüllt"
            />
            <ReviewItemStatus
                selected={value === "partially approved"}
                onclick={() => onChange("partially approved")}
                option="Teilweise erfüllt"
            />
        </div>
    );
};

export default PersonStatusSelector;
