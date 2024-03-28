import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, FileButton, FileInput, Group, Text, Table } from '@mantine/core';
import { URL } from '../../constants';
import { modals } from '@mantine/modals';
import { addStudent, updateStudent } from '../../services/apiServices';

function parseName(name) {
    if (name === undefined) return '';
    const fullName = name.split(','); // split the name into an array
    const lastName = fullName[0].trim(); // get the first element and remove any leading or trailing spaces
    const firstName = fullName[1].trim(); // get the second element and remove any leading or trailing spaces
    return `${firstName} ${lastName}`; // return the first and last name in the correct order
};

async function readFile(file, callback = data => data) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            resolve(callback(data));
        };
        reader.onerror = (e) => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsArrayBuffer(file);
    });
};

function ImportStudents({ onImport = () => console.log('onImport function called'), students = null, onCancel }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    // const [table, setTable] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [matchedStudents, setMatchedStudents] = useState([]);
    const [newStudents, setNewStudents] = useState([]);
    const [importedStudents, setImportedStudents] = useState([]);

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
            const updatedStudent = { studentId: student.ID, studentName, classes: Array.from(new Set([...classes, file.name.split('.')[0]])), lastLogin, lastLogout, lastClass, loginTimestamps};
            // return a promise that resolves when the student is updated in the database
            return new Promise((resolve, reject) => {
                updateStudent(updatedStudent.studentId, updatedStudent).then((response) => {
                    resolve(updatedStudent);
                }).catch((error) => {
                    console.log("Error updating student", error, updatedStudent);
                    reject("failed in matched students promise",error);
                });
            });
        });
        console.log("New Students Arr", newStudentsArr);
        console.log("Matched Students Arr", matchedStudentsArr);
        // Promise.all(newStudentsArr).then((newStudents) => {
        //     console.log("New Students Added", newStudents);
        //     window.alert("New students added!");
        // }).catch((error) => {
        //     console.error("Error adding new students:", error);
        // });
        // Promise.all(matchedStudentsArr).then((updatedStudents) => {
        //     console.log("Matched Students Updated", updatedStudents);
        //     window.alert("Matched students updated!");
        // }).catch((error) => {
        //     console.error("Error updating matched students:", error);
        // });
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

    function parseExcel(data) {
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        let sheetJSON = XLSX.utils.sheet_to_json(sheet);
        if (sheetJSON.length === 0 || sheetJSON[0].ID === undefined || sheetJSON[0].Name === undefined) {
            setError('Invalid file format');
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
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            // setFileName(file.name.split('.')[0]);
            setError(null);
        }
    };

    const handleImport = () => {
        if (file) {
            try {
                readFile(file, parseExcel).then((sheetToJSON) => {
                    setImportedStudents(sheetToJSON);
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
                setError('Failed to read file');
                console.error(error);
            }
        } else {
            setError('Please select a file');
        }
    };

    // function that produces jsx for the matched students
    const matchedStudentsJSX = () => {
        let jsx = [];
        if (matchedStudents.length > 0) {
            // console.log("Matched Students", matchedStudents);
            for (const student of matchedStudents) {
                const { ID, studentName, Name, classes } = student;
                const classesStr = classes.join(',');
                jsx.push(
                    <div key={ID}>
                        <Text>{`${ID} ${studentName} ${Name}`}</Text>
                        <Text>Classes: {classesStr}</Text>
                    </div>
                );
            }
        }
        return jsx;
    }

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
        // setFileName(file ? file.name.split('.')[0] : null);
        if (file) {
            console.log("File", file);
            // setFileName(file.name.split('.')[0]);
            handleImport();
        } else {
            setMatchedStudents([]);
            setImportedStudents([]);
            setNewStudents([]);
        }
        // console all state variables
        // console.log("File", file, "Error", error, "FileName", fileName, "Matched Students", matchedStudents, "New Students", newStudents, "Imported Students", importedStudents, "Students", students);
    }, [file]);

    return (
        <div>
            <Group justify='center'>
                <Button onClick={onCancel}>Cancel</Button>
                <FileButton onChange={setFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    {(props) => <Button {...props}>Upload File</Button>}
                </FileButton>
                <Button onClick={openModal} disabled={file ? false : true}>Import Students</Button>
            </Group>
            {file && (
                <Text size="sm" ta="center" mt="sm">
                    Picked file: {file.name}
                </Text>
            )}
            {/* <input type="file" onChange={handleFileChange} /> */}
            {error && <Text c="red">{error}</Text>}
            <Text>Name of Class: {(file ? file.name.split('.')[0] : '')}</Text>
            <Text>Found Students:</Text>
            {/* {(matchedStudents.length > 0) && matchedStudentsJSX()} */}
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