'use client'
import {FC, useState} from "react";
import Button from "@/components/Button";
import {twMerge} from "tailwind-merge";

interface CompleteButtonProps {
    onClick: () => void;
    disabled: boolean;
}

const CompleteButton: FC<CompleteButtonProps> = ({onClick, disabled}) => {

    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className={twMerge("my-5", disabled && "hidden")}>
            {
                expanded ? <div className={"flex items-center justify-center gap-3 w-full"}>
                    <Button className={"w-full text-xl font-medium bg-lightRed"} onClick={onClick}>
                        Ja
                    </Button>
                    <Button className={"w-full text-xl font-medium bg-neutral-400"} onClick={() => setExpanded(false)}>
                        Abbrechen
                    </Button>

                </div> : <Button onClick={() => setExpanded(true)} disabled={disabled}
                                 className={twMerge("w-full text-xl font-medium", disabled && "hidden")}>
                    Abschliessen
                </Button>
            }


        </div>
    );
}

export default CompleteButton;
