import axios from 'axios';
import React, { useState } from 'react';
import { URL } from '../App';

const Login = ({setLoginStatus, setStudent, loginStatus}) => {

    const [studentId, setStudentId] = useState('');

    const handleGetStudent = async () => {
        try {
            setLoginStatus('Logging in...');
            const response = await axios.get(`${URL}/api/student`, { params: {studentId: studentId} });
            setStudent(response.data);
            setLoginStatus('');
        } catch (error) {
            console.error('Error getting student:', error);
            setLoginStatus("Login failed. Please try again.");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleGetStudent();
        }
    };

    return (
        <div>
            <h1>Student Login</h1>
            <label htmlFor="studentId">Student ID</label>
            <input
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            />
            <button onClick={handleGetStudent}>Login</button>
            <div>
                {loginStatus}
            </div>
        </div>  
    )
}

export default Login;