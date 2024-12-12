import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({label, ...props}) => (
    <label className="flex items-center">
        <input type="checkbox" {...props} className="mr-2"/>
        {label}
    </label>
);

export default Checkbox;
