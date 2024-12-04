import {FC, useState} from "react";
import Collapsable from "@/components/Collapsable";
import Button from "@/components/Button";
import PersonItem from "@/components/review/PersonItem";
import PersonTypeSelect from "@/components/review/PersonTypeSelect";
import PersonStatusSelector from "@/components/review/PersonStatusSelector";
import {useReview} from "@/context/ReviewContext";
import {v4 as uuid4} from "uuid";
import {twMerge} from "tailwind-merge";
import {Person} from "@/types";

interface PersonListProps {
    reviewItemID: string;
    initialPersons: Person[];
}

const PersonList: FC<PersonListProps> = ({reviewItemID, initialPersons}) => {
    const [persons, setPersons] = useState<Person[]>(initialPersons || []);
    const {addPersonToReviewItem, deletePersonFromReviewItem, review} = useReview();
    const [addNew, setAddNew] = useState<boolean>(false);

    const [newPerson, setNewPerson] = useState<Person>({
        id: uuid4(),
        type: "Pflegepersonal",
        status: "not reviewed",
    });

    const addPerson = () => {
        setPersons([...persons, newPerson]);
        setAddNew(false);
        addPersonToReviewItem(reviewItemID, newPerson);
        setNewPerson({
            id: uuid4(),
            type: "Pflegepersonal",
            status: "not reviewed",
        });
    };

    const deletePerson = (personID: string) => {
        setPersons(persons.filter(person => person.id !== personID));
        deletePersonFromReviewItem(reviewItemID, personID);
    };

    return (
        <Collapsable border={false} _isOpen={false} title="Personen erfassen">
            <div className="flex my-5 flex-col divide-y">
                {persons && persons.map(person => (
                    <PersonItem key={person.id} person={person} onDelete={deletePerson}/>
                ))}
                {persons.length === 0 && <p className={"text-xs opacity-60"}>
                    keine Personen erfasst.
                </p>}
            </div>
            {
                addNew ? (
                    <div className="flex flex-col gap-2 mt-4">
                        <p>Neue Person hinzufügen:</p>
                        <PersonTypeSelect
                            value={newPerson.type}
                            onChange={type => setNewPerson({...newPerson, type})}
                        />
                        <PersonStatusSelector
                            value={newPerson.status}
                            onChange={status => setNewPerson({...newPerson, status})}
                        />
                        <Button disabled={newPerson.status === "not reviewed"} onClick={addPerson}>
                            Hinzufügen
                        </Button>
                    </div>
                ) : (
                    <Button disabled={review?.status === 'complete'}
                            className={twMerge("w-full ", review?.status === "complete" && "hidden")}
                        onClick={() => setAddNew(true)}>Neue Person hinzufügen</Button>
                )
            }
        </Collapsable>
    );
};

export default PersonList;
