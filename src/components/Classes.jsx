import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../App';

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
        <>
            <h1>Classes</h1>
            <h2>Hi, {name}!</h2>
            <div>
                {classes.length === 0 && 
                    (
                        <>
                            <p>No classes found, please contact lab assistance.</p>
                            <button onClick={() => setStudent({})}>Logout</button>
                        </>
                    )
                }
                { classes.length > 0 &&
                (<select
                value={selectedClass}
                onChange={onClassChange}
                >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                        <option key={cls} value={cls}>
                        {cls}
                        </option>
                    ))}
                </select>)}
            </div>
            <div>
                {selectedClass && loggedIn && (
                    <>
                        <p>Logged in to {selectedClass}</p>
                        <p>Time Spent: {secondsToHoursMinutesSeconds(timer)} (hours:minutes:seconds)</p>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
                {selectedClass && !loggedIn && (
                    <button onClick={() => handleLogin(selectedClass)}>Login</button>)}
            </div>
        </>
    );
};

export default Classes;