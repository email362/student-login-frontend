import { useState } from 'react';
import { TextInput, Button, Title, Box, Notification } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '@src/services/apiServices';

const Login = () => {

    const [loginStatus, setLoginStatus] = useState('');
    const [studentId, setStudentId] = useState('');
    const navigate = useNavigate();

    const handleLoginStatus = (status) => {
        setLoginStatus(status);
        setTimeout(() => {
            setLoginStatus('');
        }, 3000);
    };

    const handleGetStudent = () => {
        setLoginStatus('Logging in...');
        if (studentId === '') {
            handleLoginStatus('Please enter a student ID.');
            return;
        }
        getStudent(studentId)
            .then((student) => {
                if (student === null) {
                    handleLoginStatus("No Language Classes found. Please see MLC Staff.");
                } else {
                    setLoginStatus('');
                    navigate(`/students/${studentId}`, { replace: true });
                }
            })
            .catch(error => {
                console.error('Error getting student:', error);
                handleLoginStatus('Error getting student. Please try again.');
            });
    };

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