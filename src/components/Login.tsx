import React, { useCallback } from 'react';

// Define the prop types for the Login component
interface LoginProps {
    handleGetStudent: () => Promise<void>;  // Function that handles student login and returns a promise
    studentId: string;                      // Current value of the student ID input
    setStudentId: React.Dispatch<React.SetStateAction<string>>;  // Function to update the student ID
}

const Login: React.FC<LoginProps> = ({ handleGetStudent, studentId, setStudentId }):JSX.Element => {
    // Handle changes to the student ID input
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setStudentId(e.target.value);
    }, [setStudentId]);

    return (
        <div>
            <h1>Student Login</h1>
            {/* Input group for student ID */}
            <div className="input-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                    id="studentId"
                    type="text"
                    placeholder="001234567"
                    value={studentId}
                    onChange={handleInputChange}
                />
            </div>
            {/* Button to trigger student login */}
            <button onClick={handleGetStudent}>Login</button>
        </div>  
    )
}

export default Login;
