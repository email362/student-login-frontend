import { useState } from 'react';
import axios from 'axios';
import './App.css';

const URL = 'http://localhost:5000';

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
          <div>
            <h1>Student Login</h1>
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        ) : (
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            {selectedClass && (
              <button onClick={handleLogout}>Logout</button>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

