import React from 'react'; // Import React
import {twMerge} from 'tailwind-merge'; // Import twMerge for merging Tailwind classes

// Define interface for TextInput props
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string; // Optional prop for additional class names
}

// TextInput component
const TextInput: React.FC<TextInputProps> = ({className, ...props}) => {
    return (
        <input
            {...props} // Spread other input props
            className={twMerge(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightGreen', // Default styles
                className // Merge with additional class names if provided
            )}
        />
    );
};

export default TextInput; // Export the TextInput component
