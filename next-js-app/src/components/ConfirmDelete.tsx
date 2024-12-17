'use client'
import {FC, useState} from "react";
import Button from "@/components/Button";

interface ConfirmDeleteProps {
    onDelete: () => void;
    text: string;
    confirmText: string;
    disabled?: boolean;
}

const ConfirmDelete: FC<ConfirmDeleteProps> = ({onDelete, confirmText, text, disabled}) => {

    const [confirm, setConfirm] = useState(false);

    return (
        <div>
            {
                confirm ? (
                    <div className={"flex gap-2"}>
                        <Button disabled={disabled} red onClick={() => {
                            onDelete();
                            setConfirm(false);
                        }}>
                            {confirmText}
                        </Button>
                        <Button disabled={disabled} onClick={() => {
                            setConfirm(false);
                        }}>
                            Abbrechen
                        </Button>
                    </div>
                ) : <Button disabled={disabled} red onClick={() => {
                    setConfirm(true);
                }}>
                    {text}
                </Button>
            }

        </div>
    );
}

export default ConfirmDelete;
