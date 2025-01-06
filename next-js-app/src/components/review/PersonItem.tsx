import {FC} from "react"; // Importing Function Component type from React
import Button from "@/components/Button"; // Button component for actions
import {twMerge} from "tailwind-merge"; // Utility to merge Tailwind CSS classes
import {useReview} from "@/context/ReviewContext"; // Context for managing review data
import {Person} from "@/types"; // Importing Person type definition

// Props type definition for the PersonItem component
interface PersonItemProps {
    person: Person; // The person object to display
    onDelete: (person: Person) => void; // Callback to handle deletion of the person
}

// Functional component to render a person item within a review
const PersonItem: FC<PersonItemProps> = ({person, onDelete}) => {
    const {review} = useReview(); // Access review context

    // Function to return a status label based on the person's status
    const getStatusLabel = (status: string) => {
        switch (status) {
            case "approved":
                return "Erfüllt"; // Translates to "Fulfilled"
            case "failed":
                return "Nicht erfüllt"; // Translates to "Not fulfilled"
            case "partially approved":
                return "Teilweise erfüllt"; // Translates to "Partially fulfilled"
            default:
                return "Nicht bewertet"; // Translates to "Not reviewed"
        }
    };

    return (
        <div
            className={twMerge(
                "flex p-3 items-center justify-between gap-2",
                person.status === "failed" ? "bg-red-50" : "bg-green-50" // Red or green background based on status
            )}
        >
            {/* Person information */}
            <p className="text-gray-600">
                <span className="font-semibold">{person.type}</span> (
                {getStatusLabel(person.status)})
            </p>

            {/* Delete button, hidden if the review is complete */}
            <div className="flex items-center justify-center gap-4">
                <Button
                    className={review?.status === "complete" ? "hidden" : ""}
                    onClick={() => onDelete(person)}
                >
                    Löschen
                </Button>
            </div>
        </div>
    );
};

export default PersonItem; // Exporting the component for use in other parts of the application
