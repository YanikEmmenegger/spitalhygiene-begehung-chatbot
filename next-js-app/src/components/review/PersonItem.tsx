import {FC} from "react";
import Button from "@/components/Button";
import {twMerge} from "tailwind-merge";
import {useReview} from "@/context/ReviewContext";
import {Person} from "@/types";

interface PersonItemProps {
    person: Person;
    onDelete: (person: Person) => void;
}

const PersonItem: FC<PersonItemProps> = ({person, onDelete}) => {

    const {review} = useReview();

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "approved":
                return "Erfüllt";
            case "failed":
                return "Nicht erfüllt";
            case "partially approved":
                return "Teilweise erfüllt";
            default:
                return "Nicht bewertet";
        }
    };

    return (
        <div
            className={twMerge("flex p-3 items-center justify-between gap-2", person.status === 'failed' ? "bg-red-50" : "bg-green-50")}>
            <p className="text-gray-600">
                <span className="font-semibold">{person.type}</span> ({getStatusLabel(person.status)})
            </p>

            <div className="flex items-center justify-center gap-4">
                <Button className={review!.status === 'complete' ? "hidden": ""} onClick={() => onDelete(person)}>Löschen</Button>
            </div>
        </div>
    );
};

export default PersonItem;
