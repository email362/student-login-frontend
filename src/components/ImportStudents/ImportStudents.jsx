import { useCallback, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, FileButton, Group, Text, Table } from '@mantine/core';
import { modals } from '@mantine/modals';
import { addStudent, updateStudent } from '@services/apiServices';
import { useFileReader } from '@hooks/useFileReader';

/**
 * Parses a name string in the format of "Last, First" and returns a name string in the format of "First Last".
 *
 * @param {string} name - Name formatted as "Lastname, Firstname"
 * @returns {string} The space separated first and last name "First Last"
 */
function parseName(name) {
    if (name === undefined) return '';
    const fullName = name.split(','); // split the name into an array
    const lastName = fullName[0].trim(); // get the first element and remove any leading or trailing spaces
    const firstName = fullName[1].trim(); // get the second element and remove any leading or trailing spaces
    return `${firstName} ${lastName}`; // return the first and last name in the correct order
}

/**
 * 
 * 
 * @typedef {Object} Timestamp
 * @property {string} className - The name of the class.
 * @property {Date} loginTime - The login time of the student in unix time.
 * @property {Date} logoutTime - The logout time of the student in unix time.
 * @property {number} totalTime - The total time the student spent in the class in seconds.
 * 
 */

/**
 * The Student object definition for the students array.
 * 
 * @typedef {Object} Student
 * @property {string} studentId - The ID of the student.
 * @property {string} studentName - The name of the student.
 * @property {String[]} classes - The classes the student is enrolled in.
 * @property {Date} lastLogin - The last login time of the student in unix time.
 * @property {Date} lastLogout - The last logout time of the student in unix time.
 * @property {string} lastClass - The last class the student attended.
 * @property {Timestamp[]} loginTimestamps - The login timestamps of the student.
 */

/**
 * Component for importing students from a file.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onImport - The function to be called when importing students. Defaults to logging a message to the console.
 * @param {Student[]} props.students - The array of existing students.
 * @param {Function} props.onCancel - The function to be called when canceling the import.
 * @returns {JSX.Element} The ImportStudents component.
 */
function ImportStudents({ onImport = () => console.log('onImport function called'), students = null, onCancel }) {
    const [matchedStudents, setMatchedStudents] = useState([]);
    const [newStudents, setNewStudents] = useState([]);
    const { file, error, readFile, handleFileChange } = useFileReader();

    onImport = () => {
        console.log("Importing students");
        console.log("New Students", newStudents);
        console.log("Matched Students", matchedStudents);

        let newStudentsArr = newStudents.map((student) => {
            const newStudent = { studentId: student.ID, studentName: student.Name, classes: [file.name.split('.')[0]] };
            // return a promise that resolves when the student is added to the database
            return new Promise((resolve, reject) => {
                addStudent(newStudent).then((response) => {
                    if (response) {
                        resolve(newStudent);
                    } else {
                        reject(new Error(`Failed to add student: ${newStudent.studentName} with ID: ${newStudent.studentId}`));
                    }
                }).catch((error) => {
                    reject(error);
                    window.alert("Error adding new students");
                });
            });
        });
        let matchedStudentsArr = matchedStudents.map((student) => {
            const findMatchedStudent = students.find((s) => s.studentId === student.ID && !s.classes.includes(file.name.split('.')[0]));
            if (!findMatchedStudent) return;
            const { studentName, classes, lastLogin, lastLogout, lastClass, loginTimestamps } = findMatchedStudent;
            const updatedStudent = { studentId: student.ID, studentName, classes: Array.from(new Set([...classes, file.name.split('.')[0]])), lastLogin, lastLogout, lastClass, loginTimestamps };
            // return a promise that resolves when the student is updated in the database
            return new Promise((resolve, reject) => {
                updateStudent(updatedStudent.studentId, updatedStudent).then((response) => {
                    console.log(response);
                    resolve(updatedStudent);
                }).catch((error) => {
                    console.log("Error updating student", error, updatedStudent);
                    reject("failed in matched students promise", error);
                });
            });
        });
        console.log("New Students Arr", newStudentsArr);
        console.log("Matched Students Arr", matchedStudentsArr);

        Promise.all([...newStudentsArr, ...matchedStudentsArr]).then((response) => {
            console.log("Response", response);
            console.log("All students added or updated");
            window.alert("All students added or updated!");
            onCancel();
        }).catch((error) => {
            console.error("Error adding or updating students: in promise all array", error);
            window.alert("Error adding or updating students", error);
            onCancel();
        });
        // once all the students are added or updated, window.alert the user

    };

    const openModal = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                This will import all the students listed into the database. Are you sure you want to continue?
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => onImport(),
    });

    /**
     * Parses the Excel data and returns an array of parsed student objects.
     *
     * @param {any} data - The Excel data to be parsed.
     * @returns {Array} - An array of parsed student objects.
     * @throws {Error} - If the file format is invalid.
     */
    const parseExcel = useCallback((data) => {
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let sheetJSON = XLSX.utils.sheet_to_json(sheet);
        if (sheetJSON.length === 0 || sheetJSON[0].ID === undefined || sheetJSON[0].Name === undefined) {
            // setError('Invalid file format');
            throw new Error('Invalid file format');
        }
        sheetJSON = sheetJSON.map((student) => {
            const { ID, Name } = student;
            const studentName = parseName(Name);
            let found = false;
            let nameMatch = true;
            let hasClass = false;
            let match = students.find((s) => s.studentId === student.ID);
            if (match) {
                found = true;
                nameMatch = match.studentName === studentName;
                if (nameMatch) {
                    console.log(match.classes, file.name.split('.')[0], match.classes.includes(file.name.split('.')[0]));
                }
                hasClass = match.classes.includes(file.name.split('.')[0]);
            }
            const parsedStudent = { ID, Name: studentName, found, nameMatch, hasClass };
            console.log("Parsed Student", parsedStudent);
            return parsedStudent;
        });
        return sheetJSON;
    }, [file, students]);

    /**
     * Handles the import of students from a file.
     * 
     * @function handleImport
     * @returns {void}
     */
    const handleImport = useCallback(() => {
        if (file) {
            // wrap readFile in useCallback to avoid re-renders
            try {
                readFile(file, parseExcel).then((sheetToJSON) => {
                    // setImportedStudents(sheetToJSON);
                    let matchedStudents = [];
                    let newStudents = [];
                    for (const student of sheetToJSON) {
                        console.log("Student", student);
                        let match = students.find((s) => s.studentId === student.ID);
                        if (match) {
                            if (!match.classes.includes(file.name.split('.')[0])) {
                                matchedStudents.push({ ...student, ...match });
                            }
                        } else {
                            newStudents.push({ ...student, ...match });
                        }
                    }
                    console.log("Matched Students", matchedStudents);
                    console.log("New Students", newStudents);
                    setMatchedStudents(matchedStudents);
                    setNewStudents(newStudents);
                    console.log("Data", sheetToJSON);
                });
            } catch (error) {
                console.error(error);
            }
        }
    }, [file, parseExcel, students, readFile]);

    const newStudentRows = newStudents.map((student) => (
        <Table.Tr key={student.ID}>
            <Table.Td>{student.ID}</Table.Td>
            <Table.Td>{student.Name}</Table.Td>
        </Table.Tr>
    ));
    const matchedStudentRows = matchedStudents.map((student) => (
        <Table.Tr key={student.ID}>
            <Table.Td>{student.ID}</Table.Td>
            <Table.Td>{student.Name}</Table.Td>
        </Table.Tr>
    ));

    useEffect(() => {
        if (file) {
            console.log("File", file);
            handleImport();
        } else {
            setMatchedStudents([]);
            setNewStudents([]);
        }
    }, [file, handleImport]);

    return (
        <div>
            <Group justify='center'>
                <Button onClick={onCancel}>Cancel</Button>
                <FileButton onChange={handleFileChange} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    {(props) => <Button {...props}>Upload File</Button>}
                </FileButton>
                <Button onClick={openModal} disabled={file ? false : true}>Import Students</Button>
            </Group>
            {file && (
                <Text size="sm" ta="center" mt="sm">
                    Picked file: {file.name}
                </Text>
            )}
            {error && <Text c="red">{error}</Text>}
            <Text>Name of Class: {(file ? file.name.split('.')[0] : '')}</Text>
            <Text>Found Students:</Text>
            {error ? <Text c="red">{error}</Text> : (<>
                <Table stickyHeader striped verticalSpacing={"md"} captionSide='top' withTableBorder highlightOnHover>
                    <Table.Caption>{file ? `New students found from ${file.name}` : `Upload a class file to show students here`}</Table.Caption>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Name</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{newStudentRows}</Table.Tbody>
                </Table>
                <Table stickyHeader striped verticalSpacing={"md"} captionSide='top' withTableBorder highlightOnHover>
                    <Table.Caption>{file ? `Existing students from ${file.name}` : `Upload a class file to show students here`}</Table.Caption>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Name</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{matchedStudentRows}</Table.Tbody>
                </Table></>
            )}

        </div>
    );
}

export default ImportStudents;