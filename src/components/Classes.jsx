import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../App';
import { Title, Text, Button, Select, Box, Stack } from '@mantine/core';

/**
 * Converts seconds to hours, minutes, and seconds format.
 * @param {number} seconds - The total number of seconds to be converted.
 * @returns {string} The formatted time string in the format of "hh:mm:ss".
 */
function secondsToHoursMinutesSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - (hours * 3600)) / 60);
    const secondsLeft = Math.round(seconds - (hours * 3600) - (minutes * 60));
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
}

const Classes = ({ classes, name, studentId, setStudent}) => {

    const [selectedClass, setSelectedClass] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [timer, setTimer] = useState(0);
    const [startTimer, setStartTimer] = useState(false);

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

    const onClassChange = (e) => {
        const updatedClass = e.target.value;
        setSelectedClass(updatedClass);
    };

    const handleLogin = async (classToSend) => {
        try {
          const response = await axios.post(`${URL}/api/login`, { studentId: studentId, className: classToSend });
          setLoggedIn(true);
          setStartTimer(true);
        } catch (error) {
          console.error('Error logging in:', error);
        }
    };

    const handleLogout = async () => {
        try {
          await axios.post(`${URL}/api/logout`, { studentId: studentId });
          setStudent({});
          setStartTimer(false);
          setLoggedIn(false);
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 400 }} mx="auto">
            <Stack spacing="md">
                <Title order={1}>Classes</Title>
                <Title order={2}>Hi, {name}!</Title>

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
};

export default Classes;