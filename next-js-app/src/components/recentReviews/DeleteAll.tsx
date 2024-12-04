'use client';
import {FC, useState} from "react";
import Button from "@/components/Button";

interface DeleteAllProps {
    onDelete: () => void;
}

const DeleteAll: FC<DeleteAllProps> = ({onDelete}) => {
    const [expanded, setExpanded] = useState<boolean>(false);


    return (
        <div className={"my-5"}>
            {
                expanded ? <div className={"flex items-center justify-center gap-3 w-full"}>
                    <Button className={"w-full bg-lightRed"} onClick={onDelete}>
                        Ja
                    </Button>
                    <Button className={"w-full bg-neutral-400"} onClick={() => setExpanded(false)}>
                        Abbrechen
                    </Button>

                </div> : <Button onClick={() => setExpanded(true)} className={"w-full bg-lightRed"}>
                    Alle Begehungen löschen?
                </Button>
            }


        </div>
    )
}

export default DeleteAll;
