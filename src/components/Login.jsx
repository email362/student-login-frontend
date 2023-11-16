import axios from 'axios';
import React, { useState } from 'react';
import { URL } from '../App';

const Login = ({setLoginStatus, setStudent, loginStatus}) => {

    const [studentId, setStudentId] = useState('');

    const handleLoginStatus = (status) => {
        setLoginStatus(status);
        setTimeout(() => {
            setLoginStatus('');
        }, 3000);
    };

    const handleGetStudent = async () => {
        if(studentId === '') {
            handleLoginStatus('Please enter a student ID.');
            return;
        }
        try {
            setLoginStatus('Logging in...');
            const response = await axios.get(`${URL}/api/student`, { params: {studentId: studentId} });
            if(response.data === null) {
                setLoginStatus("Login failed. Please try again.");
                console.log("response.data is null");
                return;
            }
            setStudent(response.data);
            setLoginStatus('');
        } catch (error) {
            console.error('Error getting student:', error);
            handleLoginStatus('Error getting student. Please try again.');
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