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
    if (!response.ok) {
        throw new Error("Failed to add student in addStudent " + response.statusText);
    }
    const data = await response.json();
    console.log("addStudent data: ", data);
    return data;
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
    if (!response.ok) {
        throw new Error("Failed to update student in updateStudent " + response.statusText);
    }
    const data = await response.json();
    return data;
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
};

/**
 * Retrieves a list of students from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of student objects.
 * @throws {Error} If the API request fails or returns an error status.
 */
export const getStudents = async () => {
    const response = await fetch(`${URL}/api/students`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error("Failed to get students in getStudents " + response.statusText);
    }
    const data = await response.json();
    return data;
};

/**
 * Deletes a student from the server.
 * @param {string} studentId - The ID of the student to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the deleted student data.
 * @throws {Error} - If the deletion fails, an error is thrown with the corresponding error message.
 */
export const deleteStudent = async (studentId) => {
    const response = await fetch(`${URL}/api/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error("Failed to delete student in deleteStudent " + response.statusText);
    }
    const data = await response.json();
    return data;
};

/**
 * Logs in a student with the provided student ID and class name.
 * @param {string} studentId - The ID of the student.
 * @param {string} className - The name of the class.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 * @throws {Error} - If the login request fails.
 */
export const studentLogin = async (studentId, className) => {
    const response = await fetch(`${URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, className })
    });
    if (!response.ok) {
        throw new Error("Failed to login student in studentLogin " + response.statusText);
    }
    const data = await response.json();
    return data;
};

/**
 * Logs out a student by sending a POST request to the logout API endpoint.
 * @param {string} studentId - The ID of the student to be logged out.
 * @returns {Promise<any>} - A promise that resolves to the response data from the API.
 * @throws {Error} - If the logout request fails, an error is thrown with the corresponding error message.
 */
export const studentLogout = async (studentId) => {
    const response = await fetch(`${URL}/api/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
    });
    if (!response.ok) {
        throw new Error("Failed to logout student in studentLogout " + response.statusText);
    }
    const data = await response.json();
    return data;
};