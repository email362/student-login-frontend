import { Button, Select, Text } from "@mantine/core";
import { useState } from "react";
import { secondsToHoursMinutesSeconds } from "../../utilities/time";
/**
 * Component for exporting students' data to a CSV file.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.students - The array of student objects.
 * @returns {JSX.Element} The ExportStudents component.
 */
export default function ExportStudents({ students }) {

    const [value, setValue] = useState('');

    // Need to make a list of every unique class in the students array
    // Then, display a dropdown of all the classes
    // Then, when a class is selected
    // Export a CSV of all the students in that class along with their student ID and total hours

    const uniqueClassesSet = new Set();
    students.forEach((student) => {
        student.classes.forEach((classItem) => {
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
        const studentsWithClass = students.filter((student) => {
            return student.classes.includes(classItem);
        });

        // create a new array of objects with the student ID, student name, and total hours
        const studentsWithClassArray = studentsWithClass.map((student) => {
            // Sum up total hours from timestamps associated with the classItem from the student.loginTimestamps array
            // add error checking for if the student has no loginTimestamps
            const totalSeconds = student.loginTimestamps.reduce((accumulator, timestamp) => {
                if (timestamp.className === classItem) {
                    return accumulator + timestamp.totalTime;
                }
                return accumulator;
            }
                , 0);
            // console.log("total seconds", totalSeconds);

            // console.log("total hours", totalHours);
            return {
                studentID: student.studentId,
                studentName: student.studentName,
                totalSeconds: totalSeconds,
                timestamps: student.loginTimestamps.filter((timestamp) => {
                    return timestamp.className === classItem;
                })
            };
        });

        // create a CSV string
        let csv = 'ID, Last Name, First Name, Date, Time In, Time Out, Elapsed Time, Class\n';
        studentsWithClassArray.forEach((student) => {
            console.log(student, "student");
            const firstName = student.studentName.split(' ')[0];
            // last name can be more than one word
            const lastName = student.studentName.split(' ').slice(1).join(' ');
            // iterate through each timestamp associated with the classItem from the student.loginTimestamps array
            student.timestamps.forEach((timestamp) => {
                // if the timestamp is associated with the classItem, add it to the CSV string
                if (timestamp.className === classItem) {
                    const timeFormatOptions = {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                    }
                    const loginDate = new Date(timestamp.loginTime);
                    const logoutDate = new Date(timestamp.logoutTime);
                    // const loginTime = {
                    //     hours: loginDate.getHours(),
                    //     minutes: loginDate.getMinutes(),
                    //     seconds: loginDate.getSeconds()
                    // }
                    // const logoutTime = {
                    //     hours: logoutDate.getHours(),
                    //     minutes: logoutDate.getMinutes(),
                    //     seconds: logoutDate.getSeconds()
                    // }
                    const year = loginDate.getFullYear();
                    const month = loginDate.getMonth() + 1;
                    const day = loginDate.getDate();

                    csv += `${student.studentID},${lastName},${firstName},${year}-${month}-${day},${loginDate.toLocaleTimeString(undefined, timeFormatOptions)},${logoutDate.toLocaleTimeString(undefined, timeFormatOptions)},${secondsToHoursMinutesSeconds(timestamp.totalTime)},${classItem}\n`;
                }
            });
            // create a new line showing the total hours for the student if student has any timestamps
            if (student.timestamps.length > 0) {
                csv += `Total Time: ${secondsToHoursMinutesSeconds(student.totalSeconds)}\n`;
            }
            // csv += `${student.studentID},${student.studentName},${student.totalHours}\n`;
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