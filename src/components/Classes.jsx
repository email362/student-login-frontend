import { useEffect, useState } from 'react';
import { secondsToHoursMinutesSeconds } from '@src/utilities/time';
import { Title, Text, Button, Select, Box, Stack } from '@mantine/core';
import { useLoaderData, useParams, useNavigate } from 'react-router-dom';
import { studentLogin, studentLogout } from '@src/services/apiServices';

function Classes({ setStudent = null }) {
    const { studentId } = useParams();
    const { classes, studentName } = useLoaderData();
    const [selectedClass, setSelectedClass] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [timer, setTimer] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;

        if (startTimer) {
            interval = setInterval(() => {
                setTimer(timer => timer + 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [startTimer]);

    const handleLogin = (classToSend) => {
        studentLogin(studentId, classToSend)
            .then(() => {
                setLoggedIn(true);
                setStartTimer(true);

            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    };

    const handleLogout = () => {
        studentLogout(studentId)
            .then(() => {
                setStartTimer(false);
                setLoggedIn(false);
                navigate('/', { replace: true });
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <Box sx={{ maxWidth: 400 }} mx="auto">
            <Stack spacing="md">
                <Title order={1}>Classes</Title>
                <Title order={2}>Hi, {studentName}!</Title>

                {classes.length === 0 && (
                    <Stack spacing="sm">
                        <Text>No classes found, please contact lab assistance.</Text>
                        <Button onClick={() => setStudent({})}>Logout</Button>
                    </Stack>
                )}

                {classes.length > 0 && (
                    <Select
                        disabled={loggedIn}
                        label="Select a class"
                        placeholder="Select a class"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        data={classes.map(cls => ({ value: cls, label: cls }))}
                    />
                )}

                {selectedClass && (
                    <Box>
                        {loggedIn ? (
                            <Stack spacing="sm">
                                <Text>Logged in to {selectedClass}</Text>
                                <Text>Time Spent: {secondsToHoursMinutesSeconds(timer)} (hours:minutes:seconds)</Text>
                                <Button onClick={handleLogout}>Logout</Button>
                            </Stack>
                        ) : (
                            <Button onClick={() => handleLogin(selectedClass)}>Login</Button>
                        )}
                    </Box>
                )}
            </Stack>
        </Box>
    );
}

export default Classes;