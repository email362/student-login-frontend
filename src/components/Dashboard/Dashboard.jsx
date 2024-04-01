import { useCallback, useEffect, useState } from 'react'
import EditStudentForm from '@components/EditStudentForm/EditStudentForm';
import AddStudentForm from '@components/AddStudentForm/AddStudentForm';
import TimeLogForm from '@components/TimeLogForm/TimeLogForm';
import { Table, Button, Title, Box, Modal, Group, Text, Container, TextInput } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { URL } from '@src/constants';
import ImportStudents from '@components/ImportStudents/ImportStudents';
import { IconSearch } from '@tabler/icons-react';

import './Dashboard.css'
import ExportStudents from '@components/ExportStudents/ExportStudents';


function Dashboard() {
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showEditStudentForm, setShowEditStudentForm] = useState(false);
  const [showTimeLogForm, setShowTimeLogForm] = useState(false);
  const [showImportStudentsForm, setShowImportStudentsForm] = useState(false); // change this to false before pushing to main
  const [showDashboard, setShowDashboard] = useState(true); // change this to true before pushing to main
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [debounced] = useDebouncedValue(searchVal, 200);

  useEffect(() => {
    fetch(`${URL}/api/students`)
      .then(response => response.json())
      .then(data => {
        if (import.meta.env.MODE === 'development') console.log('data', data);
        setData(data)
      })
  }, []);

  const handleEdit = (index) => {
    setSelectedStudent(filteredData[index]);
    handleDisplay('editStudent');
  };

  const handleTimeLog = (index) => {
    setSelectedStudent(filteredData[index]);
    // setShowTimeLogForm(true);
    handleDisplay('timeLog');
  };

  const handleSave = (updatedStudent) => {
    const newData = [...data];
    const index = newData.findIndex(student => student.studentId === updatedStudent.studentId);
    newData[index] = updatedStudent;
    setData(newData);
    // send the updated data to the server
    fetch(`${URL}/api/students/${updatedStudent.studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedStudent)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error))
    handleDisplay();

  };

  const handleDelete = (index) => {
    const studentId = filteredData[index].studentId;
    const newData = data.filter(student => student.studentId !== studentId);
    // delete the student from the server
    fetch(`${URL}/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('success', studentId, data);
        setData(newData);
      })
      .catch(error => {
        console.log(error)
        alert('Failed to delete student');
      })
  };

  const handleAddStudentSubmit = (newStudent) => {
    fetch(`${URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newStudent)
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === "Success") {
          setData([...data, res.student]);
          window.alert('Student added successfully');
          handleDisplay();
        }
        console.log(res);
        window.alert('Failed to add student');
        handleDisplay();
      })
      .catch(error => {
        window.alert('Failed to add student');
        console.log(error)
        handleDisplay('addStudent');
      })
  };

  const openDeleteModal = (index) =>
    modals.openConfirmModal({
      title: 'Delete Student',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this student?
        </Text>
      ),
      labels: { cancel: 'Cancel', confirm: 'Delete' },
      confirmProps: { color: 'red', variant: 'filled', autoContrast: true },
      cancelProps: { color: 'black', variant: 'default', autoContrast: true },
      onCancel: () => console.log('canceled'),
      onConfirm: () => handleDelete(index),
    });

  const handleSearch = useCallback(() => {
    if (debounced) {
      setFilteredData(data.filter(student => student.studentName.toLowerCase().includes(debounced.toLowerCase()) || student.studentId.toLowerCase().includes(debounced.toLowerCase())));
    } else {
      setFilteredData(data);
    }
  }, [debounced, data]);

  useEffect(() => {
    handleSearch();
  }, [debounced, data, handleSearch]);

  function handleDisplay(showState = '') {
    setShowAddStudentForm(false);
    setShowEditStudentForm(false);
    setShowTimeLogForm(false);
    setShowImportStudentsForm(false);
    setShowDashboard(false);
    switch (showState) {
      case 'addStudent':
        setShowAddStudentForm(true);
        break;
      case 'editStudent':
        setShowEditStudentForm(true);
        break;
      case 'timeLog':
        setShowTimeLogForm(true);
        break;
      case 'importStudents':
        setShowImportStudentsForm(true);
        break;
      default:
        setShowDashboard(true);
    }
  }

  const cancelView = () => {
    handleDisplay();
  };

  return (
    <Container size='xl'>
      <Box sx={{ padding: '20px' }}>
        <Title order={1}>MLC Admin Home</Title>
        {showDashboard && (
          <Box>
            <Box display={"flex"} justify="flex-start">
              <Button onClick={() => handleDisplay('addStudent')} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Add Student</Button>
              <TextInput
                placeholder="Search"
                size="sm"
                leftSection={<IconSearch />}
                styles={{ section: { pointerEvents: 'none' } }}
                mb="sm"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <Button onClick={() => handleDisplay('importStudents')} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Import Students</Button>
              <Modal opened={opened} onClose={close} title="Export to Spreadsheet">
                <ExportStudents students={data} />
              </Modal>
              <Button onClick={open} color="green" variant="filled" style={{}} className='btn-view-log' autoContrast>Export Time</Button>
            </Box>
            <Table striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Classes</th>
                  <th>Total Time Logged (hours)</th>
                  {/* <th>Time Log</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='students-body'>
                {filteredData.map((item, index) => {
                  const { studentName, studentId, classes, loginTimestamps } = item;
                  let timePerClassMap = new Map();
                  loginTimestamps.forEach((timestamp) => {
                    // console.log('timestamp', timestamp);
                    if (timePerClassMap.has(timestamp.className)) {
                      timePerClassMap.set(timestamp.className, timePerClassMap.get(timestamp.className) + timestamp.totalTime);
                    } else {
                      timePerClassMap.set(timestamp.className, timestamp.totalTime);
                    }
                  });
                  const formattedTimePerClass = Array.from(timePerClassMap).map(([className, totalTime]) => {
                    return `${className}: ${(totalTime / 3600).toFixed(2)}`;
                  });
                  return (
                    <tr key={studentId}>
                      <td>{studentName}</td>
                      <td>{studentId}</td>
                      <td>{classes.join(", ")}</td>
                      {/*<td>{((loginTimestamps.reduce((acc, curr) => curr.totalTime + acc, 0) / 3600)).toFixed(2)}</td>*/}
                      <td>{formattedTimePerClass.length ? formattedTimePerClass.join(", ") : "No Time Logged"}</td>
                      <td>
                        <Group>
                          <Button onClick={() => handleTimeLog(index)} className='btn-view-log' color="blue" variant="filled" autoContrast>Time Log</Button>
                          <Button onClick={() => handleEdit(index)} className='btn-edit' color="yellow" variant="filled" autoContrast>Edit Student</Button>
                          {/* <Button onClick={() => handleDelete(index)}>Delete</Button> */}
                          <Button onClick={() => openDeleteModal(index)} className='btn-delete' color="red" variant="filled" autoContrast>Delete</Button>
                        </Group>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Box>
        )}
        {showTimeLogForm && (<TimeLogForm student={selectedStudent} onSave={handleSave} onCancel={cancelView} />)}
        {showEditStudentForm && (<EditStudentForm student={selectedStudent} onSave={handleSave} onCancel={cancelView} />)}
        {showAddStudentForm && (<AddStudentForm onSubmit={handleAddStudentSubmit} onCancel={cancelView} />)}
        {showImportStudentsForm && (<ImportStudents students={data} onCancel={cancelView} />)}

      </Box>
    </Container>
  )
}

export default Dashboard;