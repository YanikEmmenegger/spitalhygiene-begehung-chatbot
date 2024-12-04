import React from "react";

interface RadioButtonProps {
    label: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({label, value, checked, onChange, disabled}) => {
    return (
        <button
            disabled={disabled}
            onClick={() => onChange(value)}
            className={`disabled:cursor-not-allowed disabled:opacity-40 w-full p-3 rounded-lg text-center font-medium transition-colors 
                        ${checked ? 'bg-lightGreen text-white border-lightGreen' : 'bg-gray-100 text-gray-700 border-gray-300'}
                        border focus:outline-none hover:bg-lightGreen hover:text-white`}
            type="button"
        >
            {label}
        </button>
    );
};

export default RadioButton;
