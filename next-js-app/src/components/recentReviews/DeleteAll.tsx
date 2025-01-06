'use client';
import {FC, useState} from "react";
import Button from "@/components/Button";

interface DeleteAllProps {
    onDelete: () => void; // Callback triggered when the delete action is confirmed
}

const DeleteAll: FC<DeleteAllProps> = ({onDelete}) => {
    // State to manage the expanded/collapsed view
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className={"my-5"}>
            {
                expanded ? (
                    // Expanded view with confirmation buttons
                    <div className={"flex items-center justify-center gap-3 w-full"}>
                        <Button
                            className={"w-full bg-lightRed"}
                            onClick={onDelete} // Call the delete callback
                        >
                            Ja
                        </Button>
                        <Button
                            className={"w-full bg-neutral-400"}
                            onClick={() => setExpanded(false)} // Collapse the view
                        >
                            Abbrechen
                        </Button>
                    </div>
                ) : (
                    // Collapsed view with the main delete button
                    <Button
                        onClick={() => setExpanded(true)} // Expand the confirmation view
                        className={"w-full bg-lightRed"}
                    >
                        Alle Begehungen löschen?
                    </Button>
                )
            }
        </div>
    );
}

export default DeleteAll;
