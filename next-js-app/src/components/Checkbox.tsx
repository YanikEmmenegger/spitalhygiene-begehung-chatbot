import React from 'react';

/**
 * CheckboxProps
 *
 * - Extends the standard input element attributes for versatility.
 * - Adds a custom property:
 *   - `label`: A string representing the label for the checkbox (required).
 */

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string; // The label text displayed next to the checkbox
}

/**
 * Checkbox Component
 *
 * - A styled checkbox component with a label for accessibility and usability.
 * - Combines the checkbox and its label into a cohesive, clickable unit.
 */

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
    <label className="flex items-center cursor-pointer">
        {/* Render the checkbox input */}
        <input
            type="checkbox"
            {...props}
            className="mr-2 w-4 h-4 text-lightGreen border-gray-300 rounded focus:ring-lightGreen"
        />
        {/* Render the associated label text */}
        <span className="text-gray-700">{label}</span>
    </label>
);

export default Checkbox;
