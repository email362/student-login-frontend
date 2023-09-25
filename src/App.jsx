import { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Classes from './components/Classes';

// const URL = 'http://localhost:5100';
export const URL = 'https://vivacious-jade-nightgown.cyclic.app';

function App() {
  const [student, setStudent] = useState({});
  // const [studentId, setStudentId] = useState('');
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [classes, setClasses] = useState([]);
  // const [selectedClass, setSelectedClass] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  // const handleGetStudent = async () => {
  //   try {
  //     setLoginStatus('Logging in...');
  //     const response = await axios.get(`${URL}/api/student`, { params: {studentId: studentId} });
  //     setStudent(response.data);
  //     setClasses(response.data.classes);
  //     setLoggedIn(true);
  //     setLoginStatus('');
  //   } catch (error) {
  //     console.error('Error getting student:', error);
  //     setLoginStatus("Login failed. Please try again.");
  //   }
  // };
  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const handleLogin = async (classToSend) => {
    try {
      const response = await axios.post(`${URL}/api/login`, { studentId: student.studentId, className: classToSend });
      // console.log(response.data)
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${URL}/api/logout`, { studentId: student.studentId });
      setStudent({});
      // setLoggedIn(false);
      // setSelectedClass('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isEmptyObject(student) ? (
          <Login 
            // handleGetStudent={handleGetStudent} 
            // studentId={student.studentId} 
            // setStudentId={setStudentId}
            loginStatus={loginStatus}
            setLoginStatus={setLoginStatus}
            // setLoggedIn={setLoggedIn}
            setStudent={setStudent}
          />
        ) : (
          <Classes 
            // selectedClass={selectedClass}
            // setSelectedClass={setSelectedClass}
            classes={student.classes}
            name={student.studentName}
            studentId={student.studentId}
            setStudent={setStudent}
          />
        )}
      </header>
    </div>
  );
}

export default App;

