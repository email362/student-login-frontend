import { URL } from '@src/constants';

/**
 * Adds a new student to the database.
 * @param {Object} newStudent - The new student object to be added.
 * @returns {Promise<Object>} - A promise that resolves to the response data if successful, or rejects with an error if unsuccessful.
 * @throws {Error} - Throws an error if the API request fails or the response status is not "Success".
 */
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

/**
 * Updates a student record in the database.
 * @param {string} studentId - The ID of the student to update.
 * @param {object} updatedStudent - The updated student object.
 * @returns {Promise<object>} - A promise that resolves to the updated student data if successful.
 * @throws {Error} - If the update operation fails, an error is thrown with a descriptive message.
 */
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

/**
 * Retrieves a student from the API based on the provided student ID.
 * @param {string} studentId - The ID of the student to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the student data.
 * @throws {Error} - If the API request fails or returns an error status.
 */
export const getStudent = async (studentId) => {
    const response = await fetch(`${URL}/api/student?studentId=${studentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error("Failed to get student in getStudent " + response.statusText);
    }
    const data = await response.json();
    return data;
}