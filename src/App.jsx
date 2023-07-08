import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Classes from './components/Classes';

// const URL = 'http://localhost:5100';
const URL = 'https://vivacious-jade-nightgown.cyclic.app';

function App() {
  const [studentId, setStudentId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const handleGetStudent = async () => {
    try {
      const response = await axios.get(`${URL}/api/student`, { params: {studentId: studentId} });
      // console.log(response);
      setClasses(response.data.classes);
      setLoggedIn(true);
    } catch (error) {
      console.error('Error getting student:', error);
    }
  };

  const handleLogin = async (classToSend) => {
    try {
      const response = await axios.post(`${URL}/api/login`, { studentId, className: classToSend });
      // console.log(response.data)
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${URL}/api/logout`, { studentId });
      setLoggedIn(false);
      setSelectedClass('');
      setStudentId('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!loggedIn ? (
          <Login 
            handleGetStudent={handleGetStudent} 
            studentId={studentId} 
            setStudentId={setStudentId}
          />
        ) : (
          <Classes 
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            classes={classes}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        )}
      </header>
    </div>
  );
}

export default App;

