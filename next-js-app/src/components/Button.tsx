import React from 'react';
import {twMerge} from 'tailwind-merge';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    red?: boolean;
}

const Button: React.FC<TextButtonProps> = ({children, red, className, ...props}) => {
    return (
        <button
            {...props}
            className={twMerge(
                'text-white transition-colors rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed',
                red ? 'bg-lightRed hover:bg-darkRed' : 'bg-lightGreen hover:bg-darkGreen', className
            )}
        >
            {children}
        </button>
    );
};

export default Button;
