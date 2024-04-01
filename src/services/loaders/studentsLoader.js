import { getStudents } from "../apiServices";

export async function studentsLoader() {
    return getStudents();
}