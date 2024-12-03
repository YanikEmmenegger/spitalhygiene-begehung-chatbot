import React from 'react';
import {twMerge} from 'tailwind-merge';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const TextInput: React.FC<TextInputProps> = ({className, ...props}) => {
    return (
        <input
            {...props}
            className={twMerge(
                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightGreen',
                className
            )}
        />
    );
};

export default TextInput;
