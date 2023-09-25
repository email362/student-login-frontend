import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../App';

const Classes = ({ classes, name, studentId, setStudent}) => {

    const [selectedClass, setSelectedClass] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const onClassChange = (e) => {
        // console.log(e.target.value);
        const updatedClass = e.target.value;
        setSelectedClass(updatedClass);
        // handleLogin(updatedClass);
    };

    const handleLogin = async (classToSend) => {
        try {
          const response = await axios.post(`${URL}/api/login`, { studentId: studentId, className: classToSend });
          setLoggedIn(true);
          // console.log(response.data)
        } catch (error) {
          console.error('Error logging in:', error);
        }
    };

    const handleLogout = async () => {
        try {
          await axios.post(`${URL}/api/logout`, { studentId: studentId });
          setStudent({});
          setLoggedIn(false);
          // setSelectedClass('');
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
                    <button onClick={handleLogout}>Logout</button>
                )}
                {selectedClass && !loggedIn && (
                    <button onClick={() => handleLogin(selectedClass)}>Login</button>)}
            </div>
        </>
    );
};

export default Classes;