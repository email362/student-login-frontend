import React, { useCallback } from 'react';
import Dropdown from './Dropdown';  // Import the Dropdown component

// Define the prop types for the Classes component
interface ClassesProps {
    selectedClass: string;  // Currently selected class
    setSelectedClass: React.Dispatch<React.SetStateAction<string>>;  // Function to update the selected class
    classes: string[];  // Array of available classes
    handleLogin: (classToSend: string) => Promise<void>;  // Function to handle the login process
    handleLogout: () => Promise<void>;  // Function to handle the logout process
}

const Classes: React.FC<ClassesProps> = ({ selectedClass, setSelectedClass, classes, handleLogin, handleLogout }):JSX.Element => {
    // Handle changes to the class dropdown
    const onClassChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedClass = e.target.value;
        setSelectedClass(updatedClass);
    }, [setSelectedClass]);

    // Handle the class selection process
    const onClassSelect = useCallback(async (className: string) => {
        await handleLogin(className);
    }, [handleLogin]);

    return (
        <div>
            {/* Dropdown component for class selection */}
            <Dropdown 
                selectedClass={selectedClass} 
                onClassChange={(e) => {
                    onClassChange(e);
                    onClassSelect(e.target.value);
                }}
                classes={classes} 
            />
            {/* Show the logout button only if a class is selected */}
            {selectedClass && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
};

export default Classes;
