import {
    TextInput,
    Button,
    Title,
    Box,
    Group,
    Stack,
    Card,
    Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { secondsToHoursMinutesSeconds } from '@utilities/time.js';
import { IconTrash } from '@tabler/icons-react';
import "./TimeLogForm.css";


/**
 * A form component for logging time stamps of a student.
 * @param {Object} props - The component props.
 * @param {Object} props.student - The student object.
 * @param {Function} props.onSave - The function to save the time log.
 * @param {Function} props.onCancel - The function to cancel the time log.
 * @returns {JSX.Element} - The TimeLogForm component.
 */
function TimeLogForm({ student, onSave, onCancel }) {

    // Formats the logoutTime and loginTime properties from utc to local time values to be displayed in the form.
    const formattedTimeStamps = student.loginTimestamps.map((timeLog) => {
        const loginDate = new Date(timeLog.loginTime);
        const logoutDate = new Date(timeLog.logoutTime);
        return {
            ...timeLog,
            loginDate,
            logoutDate
        };
    });

    // console.log("formatted timestamps", formattedTimeStamps);

    const form = useForm({
        initialValues: {
            timeStamps: formattedTimeStamps
        }
    });

    const handleAddTime = () => {
        const newDate = new Date();
        const newStudent = {
            className: '',
            loginDate: newDate,
            logoutDate: newDate,
            logoutTime: newDate.getTime(),
            loginTime: newDate.getTime(),
            totalTime: 0,
            _id: randomId()
        };
        form.insertListItem('timeStamps', newStudent);
        console.log(form.values.timeStamps);
    };

    const handleDateChange = (event, index, logType) => {
        // form.setFieldValue(`timeStamps.${index}.logoutTime`, form.values.timeStamps[index].logoutDate.getTime())
        let calc;
        switch (logType) {
            case 'login':
                form.setFieldValue(`timeStamps.${index}.loginDate`, event)
                form.setFieldValue(`timeStamps.${index}.loginTime`, event.getTime())
                calc = form.values.timeStamps[index].logoutDate.getTime() - event.getTime();
                break;
            case 'logout':
                form.setFieldValue(`timeStamps.${index}.logoutDate`, event)
                form.setFieldValue(`timeStamps.${index}.logoutTime`, event.getTime())
                calc = event.getTime() - form.values.timeStamps[index].loginDate.getTime();
                break;
            default:
                calc = 0;
                break;
        }
        console.log(Math.round(calc / 1000));
        const totalSeconds = Math.round(calc / 1000);
        form.setFieldValue(`timeStamps.${index}.totalTime`, totalSeconds);
        // form.setFieldValue(`timeStamps.${index}.totalTime`, calc);
        // form.setFieldValue(`timeStamps.${index}.logoutDate`, event)
        // form.setFieldValue(`timeStamps.${index}.logoutTime`, event.getTime())
    };

    const fields = form.values.timeStamps.map((timeLog, index) => {
        // logic to have the classes and the current class in the select input for the time log
        let data = [];
        if (student.classes) {
            data = new Set([...student.classes]);
        }
        if (!Object.prototype.hasOwnProperty.call(timeLog, '_id')) {
            timeLog._id = randomId();
        }
        if (Object.prototype.hasOwnProperty.call(timeLog, '_id') && timeLog._id !== '' && timeLog._id !== null) {
            let matchingTimeStamp = student.loginTimestamps.find((time) => time._id === timeLog._id);
            if (matchingTimeStamp) {
                data.add(matchingTimeStamp.className);
            }
        }
        data = Array.from(data);
        const border = (timeLog.totalTime == 0) ? '1px solid red' : 'default';
        return (
            <Box key={`timelog-${timeLog._id}`}>
                <Card shadow='sm' p='xs' mb='sm' style={{ border: border }}>
                    <Group justify='space-between'>
                        <Select
                            data={data}
                            label="Class:"
                            placeholder="Select class"
                            {...form.getInputProps(`timeStamps.${index}.className`)}
                            allowDeselect={false}
                        />
                        <DateTimePicker
                            // dropdownType='modal'
                            withSeconds
                            valueFormat='MM/DD/YYYY hh:mm:ss A'
                            label="Login:"
                            placeholder="Select date and time"
                            className='login-date-value'
                            {...form.getInputProps(`timeStamps.${index}.loginDate`)}
                            onChange={(event) => handleDateChange(event, index, 'login')}
                        />
                        <DateTimePicker
                            // dropdownType='modal'
                            withSeconds
                            valueFormat='MM/DD/YYYY hh:mm:ss A'
                            label="Logout:"
                            placeholder="Select date and time"
                            className='logout-date-value'
                            {...form.getInputProps(`timeStamps.${index}.logoutDate`)}
                            onChange={(event) => handleDateChange(event, index, 'logout')}
                        />
                        <TextInput
                            label="Total Time:"
                            {...form.getInputProps(`timeStamps.${index}.totalTime`)}
                            readOnly
                            value={secondsToHoursMinutesSeconds(timeLog.totalTime)}
                            onChange={(value) => form.setFieldValue(`timeStamps.${index}.totalTime`, secondsToHoursMinutesSeconds(value))}
                        />
                        <Button type="button" style={{ alignSelf: 'end' }} color="red" variant="filled" autoContrast onClick={() => form.removeListItem('timeStamps', index)}><IconTrash /></Button>
                    </Group>
                </Card>
            </Box>
        )
    });

    const handleSubmit = () => {
        console.log(student.loginTimestamps);
        console.log(form.values.timeStamps);
        // const updatedStudent = { ...student, loginTimestamps: form.values.timeStamps };
        const updatedTimeStamps = form.values.timeStamps.map((timeLog) => {
            const { className, loginTime, logoutTime, totalTime } = timeLog;

            return {
                className,
                loginTime,
                logoutTime,
                totalTime
            };
        });
        console.log('updated timestamps', updatedTimeStamps);
        const updatedStudent = { ...student, loginTimestamps: updatedTimeStamps };
        console.log('updated student', updatedStudent);
        onSave(updatedStudent);
        // const updatedStudent = { ...student, loginTimestamps: updatedTimeStamps };

    };

    return (
        <Box>
            <Title order={4}>{student.studentName}</Title>
            <form onSubmit={form.onSubmit(handleSubmit)} id="time-log-form">
                <Stack>
                    <Box>
                        {fields.length > 0 ? fields : (<p>No time logs found.</p>)}
                    </Box>
                    <Group justify='space-between'>
                        <Button type="button" onClick={handleAddTime} color="green" variant="filled" autoContrast>Add Time Log</Button>
                        <Box>
                            <Button type="submit" color="blue" variant="filled" autoContrast mr={"sm"}>Save</Button>
                            <Button type="button" onClick={onCancel} color="black" variant="default" autoContrast>Cancel</Button>
                        </Box>
                    </Group>
                </Stack>
            </form>
        </Box>
    );
}

export default TimeLogForm;