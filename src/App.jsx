import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Classes from './components/Classes';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { Container, MantineProvider, Center, Paper } from '@mantine/core';

// const URL = 'http://localhost:5100';
export const URL = 'https://vivacious-jade-nightgown.cyclic.app';

function App() {
  const [student, setStudent] = useState({});

  const [loginStatus, setLoginStatus] = useState('');

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const handleLogin = async (classToSend) => {
    try {
      const response = await axios.post(`${URL}/api/login`, { studentId: student.studentId, className: classToSend });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${URL}/api/logout`, { studentId: student.studentId });
      setStudent({});
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='dark'>
      <Center style={{ height: '100vh' }}> {/* This centers content vertically */}
        <Container size="lg" style={{ width: '100%' }}> {/* Controls max width */}
          <Paper padding="lg" shadow="xs"> {/* Optional: Adds styling to the form */}
            {/* Conditional rendering based on student object */}
            {isEmptyObject(student) ? (
              <Login 
                loginStatus={loginStatus}
                setLoginStatus={setLoginStatus}
                setStudent={setStudent}
              />
            ) : (
              <Classes 
                classes={student.classes}
                name={student.studentName}
                studentId={student.studentId}
                setStudent={setStudent}
              />
            )}
          </Paper>
        </Container>
      </Center>
    </MantineProvider>
  );
}

export default App;

