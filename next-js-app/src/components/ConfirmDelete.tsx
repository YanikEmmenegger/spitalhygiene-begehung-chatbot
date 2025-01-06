'use client';

import { FC, useState } from "react";
import Button from "@/components/Button";

/**
 * ConfirmDelete Component
 *
 * - A reusable confirmation UI component for delete actions.
 * - Displays a confirmation prompt before triggering the `onDelete` function.
 */

interface ConfirmDeleteProps {
    /**
     * Callback executed when the delete action is confirmed.
     */
    onDelete: () => void;

    /**
     * Initial button text before confirmation.
     */
    text: string;

    /**
     * Text for the confirmation button.
     */
    confirmText: string;

    /**
     * Disables all buttons when true.
     */
    disabled?: boolean;
}

/**
 * ConfirmDelete Component
 *
 * - Displays a delete button that expands to show confirmation options when clicked.
 * - Reduces accidental deletes by requiring user confirmation.
 */
const ConfirmDelete: FC<ConfirmDeleteProps> = ({ onDelete, confirmText, text, disabled }) => {
    const [confirm, setConfirm] = useState(false); // Tracks if confirmation is required

    return (
        <div>
            {confirm ? (
                // Render confirmation buttons when `confirm` is true
                <div className="flex gap-2">
                    {/* Confirm Button */}
                    <Button
                        disabled={disabled}
                        red
                        onClick={() => {
                            onDelete(); // Execute delete action
                            setConfirm(false); // Reset confirmation state
                        }}
                    >
                        {confirmText}
                    </Button>

                    {/* Cancel Button */}
                    <Button
                        disabled={disabled}
                        onClick={() => setConfirm(false)}
                    >
                        Abbrechen
                    </Button>
                </div>
            ) : (
                // Render initial delete button when `confirm` is false
                <Button
                    disabled={disabled}
                    red
                    onClick={() => setConfirm(true)}
                >
                    {text}
                </Button>
            )}
        </div>
    );
};

export default ConfirmDelete;
