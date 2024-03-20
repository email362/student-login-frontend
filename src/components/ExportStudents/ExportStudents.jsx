import { Button, Select, Text } from "@mantine/core";
import { useState } from "react";
export default function ExportStudents({ students }) {

    const [value, setValue] = useState('');

    // Need to make a list of every unique class in the students array
    // Then, display a dropdown of all the classes
    // Then, when a class is selected
    // Export a CSV of all the students in that class along with their student ID and total hours

    const uniqueClassesSet = new Set();
    students.forEach((student, index) => {
        student.classes.forEach((classItem, index) => {
            if (classItem) {
                // check if classItem is in the set
                // if not, add it
                // if it is, do nothing
                if (!uniqueClassesSet.has(classItem)) {
                    uniqueClassesSet.add(classItem);
                }
            }
        });
    });
    // create a sorted array of the unique classes sorting from A-Z
    const uniqueClassesArray = Array.from(uniqueClassesSet)
    .sort((a, b) => {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });

    const exportStudents = (classItem) => {
        // create a new array of students that have the classItem in their classes array
        const studentsWithClass = students.filter((student, index) => {
            return student.classes.includes(classItem);
        });

        // create a new array of objects with the student ID, student name, and total hours
        const studentsWithClassArray = studentsWithClass.map((student, index) => {
            // Sum up total hours from timestamps associated with the classItem from the student.loginTimestamps array
            // add error checking for if the student has no loginTimestamps
            const totalSeconds = student.loginTimestamps.reduce((accumulator, timestamp, index) => {
                if (timestamp.className === classItem) {
                    return accumulator + timestamp.totalTime;
                }
                return accumulator;
            }
            , 0);
            // console.log("total seconds", totalSeconds);

            // convert totalSeconds to hours with 2 decimal places
            const totalHours = (totalSeconds / 3600.00).toFixed(2);
            // trim to 2 decimal places

            // console.log("total hours", totalHours);
            return {
                studentID: student.studentId,
                studentName: student.studentName,
                totalHours: totalHours
            };
        });

        // create a CSV string
        let csv = 'Student ID,Student Name,Total Hours\n';
        studentsWithClassArray.forEach((student, index) => {
            csv += `${student.studentID},${student.studentName},${student.totalHours}\n`;
        });

        // create a new blob and download it
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${classItem} Timesheet.csv`;
        a.click();
    }

    return (
        <>
            <Text>Choose Class to Export</Text>
            {/* <select>
                <option value="All">All</option>
                {uniqueClassesArray.map((classItem, index) => {
                    return <option value={classItem}>{classItem}</option>
                })}
            </select> */}
            <Select data={uniqueClassesArray} value={value} onChange={setValue} />
            <Button onClick={() => exportStudents(value)}>Export</Button>
        </>
    );
}