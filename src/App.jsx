import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Classes from './components/Classes';

// deployment url 'https://vivacious-jade-nightgown.cyclic.app'

const URL = 'http://localhost:5100';

function App() {
  const [studentId, setStudentId] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loginTime, setLoginTime] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${URL}/api/login`, { studentId });
      setClasses(response.data.classes);
      setLoggedIn(true);
      setLoginTime(new Date());
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const logoutTime = new Date();
      await axios.post(`${URL}/api/log-time`, {
        studentId,
        className: selectedClass,
        loginTime,
        logoutTime,
      });
      setLoggedIn(false);
      setLoginTime(null);
      setSelectedClass('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!loggedIn ? (
          <Login 
            handleLogin={handleLogin} 
            studentId={studentId} 
            setStudentId={setStudentId}
          />
        ) : (
          <Classes 
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            classes={classes}
            handleLogout={handleLogout}
          />
        )}
      </header>
    </div>
  );
}

export default App;

