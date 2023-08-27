import React from 'react';

// Define the prop types for the Dropdown component
interface DropdownProps {
    selectedClass: string;  // Currently selected class value
    onClassChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;  // Handler for when a class is selected
    classes: string[];  // Array of available classes
}

// Dropdown component to let the user select a class
const Dropdown: React.FC<DropdownProps> = ({ selectedClass, onClassChange, classes }):JSX.Element => (
    <>
        {/* Label for the class selection dropdown */}
        <label htmlFor="classDropdown">Select a class:</label>
        {/* Dropdown to select a class */}
        <select
            id="classDropdown"
            value={selectedClass}
            onChange={onClassChange}
        >
            <option value="">Select a class</option>
            {/* Map through available classes and render them as options */}
            {classes.map((className) => (
                <option key={className} value={className}>
                    {className}
                </option>
            ))}
        </select>
    </>
);

export default Dropdown;
