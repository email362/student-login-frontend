import axios from 'axios';
import React, { useState } from 'react';
import { URL } from '../App';
import { TextInput, Button, Title, Box, Notification } from '@mantine/core';

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
                setLoginStatus("No Language Classes found. Please see MLC Staff.");
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
        <Box sx={{ maxWidth: 300 }} mx="auto">
            <Title order={1}>Student Login</Title>
            <TextInput
                label={studentId ? "Student ID" : ""}
                placeholder="Student ID"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={handleKeyDown}
                data-floating="Student ID"
            />
            <Button onClick={handleGetStudent} mt="md">
                Login
            </Button>
            {loginStatus && (
                <Notification
                    color={loginStatus.includes('Error') || loginStatus.includes("No Language") ? 'red' : 'blue'}
                    onClose={() => setLoginStatus('')}
                >
                    {loginStatus}
                </Notification>
            )}
        </Box>
    );
}

export default Login;