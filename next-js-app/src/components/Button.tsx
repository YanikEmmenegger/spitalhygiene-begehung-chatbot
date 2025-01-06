import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * TextButtonProps
 *
 * - Extends the standard button element attributes for versatility.
 * - Adds two custom properties:
 *   - `children`: The button's content (required).
 *   - `red`: Boolean to conditionally apply red styling.
 */

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; // The content to display inside the button
    red?: boolean; // Optional: Toggles red styling for the button
}

/**
 * Button Component
 *
 * - A styled button component with conditional styling for "red" and default (green) themes.
 * - Merges custom styles with Tailwind classes for a cohesive appearance.
 * - Automatically handles disabled states with appropriate styling.
 */

const Button: React.FC<TextButtonProps> = ({ children, red, className, ...props }) => {
    return (
        <button
            {...props} // Spread remaining props to the button element
            className={twMerge(
                'text-white transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed', // Base styles
                red ? 'bg-lightRed hover:bg-darkRed' : 'bg-lightGreen hover:bg-darkGreen', // Conditional styles based on `red` prop
                className // Allow additional custom styles via `className` prop
            )}
        >
            {children} {/* Render button content */}
        </button>
    );
};

export default Button;
