import { URL } from '../constants';

export const addStudent = async (newStudent) => {
    const response = await fetch(`${URL}/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
    });
    const data = await response.json();
    console.log("addStudent data: ", data);
    if(data.status == "Success") {
        return data;
    } else {
        throw new Error("Failed to add student in addStudent " + data.message);
    }
};

export const updateStudent = async (studentId, updatedStudent) => {
    const response = await fetch(`${URL}/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent)
    });
    const data = await response.json();
    console.log("updateStudent data: ", data);
    if(data.status == "Success") {
        return data;
    } else {
        throw new Error("Failed to update student in updateStudent " + data.message);
    }
};