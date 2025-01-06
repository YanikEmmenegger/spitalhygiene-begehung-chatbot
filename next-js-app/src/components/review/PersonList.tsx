import { FC, useState } from "react";
import Collapsable from "@/components/Collapsable";
import Button from "@/components/Button";
import PersonItem from "@/components/review/PersonItem";
import PersonTypeSelect from "@/components/review/PersonTypeSelect";
import PersonStatusSelector from "@/components/review/PersonStatusSelector";
import { useReview } from "@/context/ReviewContext";
import { v4 as uuid4 } from "uuid";
import { twMerge } from "tailwind-merge";
import { Person } from "@/types";

// Props for the PersonList component
interface PersonListProps {
    reviewItemID: string; // ID of the associated review item
    initialPersons: Person[]; // Initial list of persons
}

// Component to manage and display a list of persons
const PersonList: FC<PersonListProps> = ({ reviewItemID, initialPersons }) => {
    const [persons, setPersons] = useState<Person[]>(initialPersons || []); // State for list of persons
    const { addPersonToReviewItem, deletePersonFromReviewItem, review } = useReview(); // Review context actions
    const [addNew, setAddNew] = useState<boolean>(false); // State for toggling add new person form

    // State for the new person being added
    const [newPerson, setNewPerson] = useState<Person>({
        id: uuid4(),
        type: "Pflegepersonal", // Default type (e.g., nursing staff)
        status: "not reviewed", // Default status
    });

    // Function to add a new person to the list and the review item
    const addPerson = () => {
        setPersons([...persons, newPerson]);
        setAddNew(false);
        addPersonToReviewItem(reviewItemID, newPerson); // Update the review context
        setNewPerson({
            id: uuid4(),
            type: "Pflegepersonal",
            status: "not reviewed",
        });
    };

    // Function to delete a person from the list and the review item
    const deletePerson = (_person: Person) => {
        setPersons(persons.filter((person) => person.id !== _person.id)); // Update local state
        deletePersonFromReviewItem(reviewItemID, _person); // Update the review context
    };

    return (
        <Collapsable border={false} _isOpen={false} title="Berufsgruppe erfassen">
            {/* List of persons */}
            <div className="flex my-5 flex-col divide-y">
                {persons &&
                    persons.map((person) => (
                        <PersonItem key={person.id} person={person} onDelete={deletePerson} />
                    ))}
                {persons.length === 0 && (
                    <p className={"text-xs opacity-60"}>keine Personen erfasst.</p>
                )}
            </div>

            {/* Add new person form */}
            {addNew ? (
                <div className="flex flex-col gap-2 mt-4">
                    <p>Neue Berufsgruppe hinzufügen:</p>
                    <PersonTypeSelect
                        value={newPerson.type}
                        onChange={(type) => setNewPerson({ ...newPerson, type })}
                    />
                    <PersonStatusSelector
                        value={newPerson.status}
                        onChange={(status) => setNewPerson({ ...newPerson, status })}
                    />
                    <Button
                        disabled={newPerson.status === "not reviewed"} // Disable if status not set
                        onClick={addPerson}
                    >
                        Hinzufügen
                    </Button>
                </div>
            ) : (
                <Button
                    disabled={review?.status === "complete"} // Disable button if review is complete
                    className={twMerge("w-full", review?.status === "complete" && "hidden")}
                    onClick={() => setAddNew(true)}
                >
                    Neue Person hinzufügen
                </Button>
            )}
        </Collapsable>
    );
};

export default PersonList;
