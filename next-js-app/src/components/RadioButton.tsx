import React from "react";

// Interface for props passed to the RadioButton component
interface RadioButtonProps {
    label: string; // The label to display for the radio button
    value: string; // The value associated with the radio button
    checked: boolean; // Whether the radio button is selected
    onChange: (value: string) => void; // Function to handle the value change
    disabled?: boolean; // Whether the radio button is disabled (optional)
}

// Functional component for a custom styled radio button
const RadioButton: React.FC<RadioButtonProps> = ({ label, value, checked, onChange, disabled }) => {
    return (
        <button
            disabled={disabled} // Disables the button if `disabled` is true
            onClick={() => onChange(value)} // Calls onChange with the button's value when clicked
            className={`disabled:cursor-not-allowed disabled:opacity-40 w-full p-3 rounded-lg text-center font-medium transition-colors 
                        ${checked
                ? 'bg-lightGreen text-white border-lightGreen' // Styles for when the button is selected
                : 'bg-gray-100 text-gray-700 border-gray-300'} // Styles for when the button is not selected
                        border focus:outline-none hover:bg-lightGreen hover:text-white`} // Common styles
            type="button" // Button type is set to prevent default form submission
        >
            {label} {/* Render the label text inside the button */}
        </button>
    );
};

export default RadioButton; // Export the component for use in other parts of the application
